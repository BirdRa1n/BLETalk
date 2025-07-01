import React, { createContext, useContext, useEffect, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { requestPermissions } from '../utils/permissions';
import { bleService } from '~/services/bleService';
import { Alert, Platform } from 'react-native';
import { router } from 'expo-router';
import * as Notifications from 'expo-notifications';

// UUIDs from ESP32 main.cpp
const DEFAULT_SERVICE_UUID = '4fafc201-1fb5-459e-8fcc-c5c9c331914b';
const DEFAULT_CHARACTERISTIC_UUID = 'beb5483e-36e1-4688-b7f5-ea07361b26a8';

// Configure notification handler
Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldPlaySound: false,
        shouldSetBadge: false,
        shouldShowBanner: true,
        shouldShowList: true,
    }),
});

interface BleContextType {
    manager: BleManager | null;
    devices: Device[];
    isScanning: boolean;
    connectedDevice: Device | null;
    startScan: () => void;
    stopScan: () => void;
    connectToDevice: (device: Device) => Promise<void>;
    disconnectDevice: () => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
    receiveMessage: (callback: (message: string) => void, enableBackgroundNotifications: boolean) => void;
}

const BleContext = createContext<BleContextType>({
    manager: null,
    devices: [],
    isScanning: false,
    connectedDevice: null,
    startScan: () => { },
    stopScan: () => { },
    connectToDevice: async () => { },
    disconnectDevice: async () => { },
    sendMessage: async () => { },
    receiveMessage: () => { },
});

async function initializeNotifications() {
    if (Platform.OS === 'android') {
        await Notifications.setNotificationChannelAsync('bleMessages', {
            name: 'BLE Messages',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }
    if (finalStatus !== 'granted') {
        Alert.alert('Notification Permissions', 'Please enable notification permissions in settings to receive BLE messages.');
        console.log('Notification permissions not granted');
    }
}

export const BleProvider: React.FC<{
    children: React.ReactNode;
    serviceUUID?: string;
    characteristicUUID?: string;
}> = ({
    children,
    serviceUUID = DEFAULT_SERVICE_UUID,
    characteristicUUID = DEFAULT_CHARACTERISTIC_UUID,
}) => {
        const [manager] = useState(new BleManager());
        const [devices, setDevices] = useState<Device[]>([]);
        const [isScanning, setIsScanning] = useState(false);
        const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

        useEffect(() => {
            // Initialize BLE and notification permissions
            Promise.all([
                requestPermissions(),
                initializeNotifications(),
            ]).then(([bleGranted]) => {
                if (!bleGranted) {
                    Alert.alert(
                        'Permissions Denied',
                        'Please enable Bluetooth permissions in settings to use this feature.',
                    );
                    console.log('Bluetooth permissions not granted');
                }
            });

            // Set up notification listeners
            const notificationListener = Notifications.addNotificationReceivedListener(notification => {
                console.log('Notification received:', notification);
            });

            const responseListener = Notifications.addNotificationResponseReceivedListener(response => {
                console.log('Notification response:', response);
            });

            return () => {
                notificationListener.remove();
                responseListener.remove();
                manager?.destroy();
            };
        }, [manager]);

        const startScan = () => {
            if (!isScanning) {
                setDevices([]);
                setIsScanning(true);
                manager?.startDeviceScan(null, null, (error, device) => {
                    if (error) {
                        setIsScanning(false);
                        Alert.alert('Scan Failed', 'Unable to scan for devices.');
                        console.error('Scan error:', error);
                        return;
                    }
                    if (device) {
                        setDevices((prev) => {
                            if (!prev.find((d) => d.id === device.id)) {
                                return [...prev, device];
                            }
                            return prev;
                        });
                    }
                });
            }
        };

        const stopScan = () => {
            manager?.stopDeviceScan();
            setIsScanning(false);
        };

        const connectToDevice = async (device: Device) => {
            try {
                await manager?.stopDeviceScan();
                console.log('Connecting to device:', device.name || 'Unnamed device', device.id);
                const connected = await device.connect();
                console.log('Device connected, discovering services...');
                await connected.discoverAllServicesAndCharacteristics();

                if (serviceUUID && characteristicUUID) {
                    const characteristics = await connected.characteristicsForService(serviceUUID);
                    const targetCharacteristic = characteristics.find((c) => c.uuid === characteristicUUID);

                    if (!targetCharacteristic) {
                        throw new Error(`Characteristic ${characteristicUUID} not found`);
                    }

                    if (!targetCharacteristic.isWritableWithResponse && !targetCharacteristic.isWritableWithoutResponse) {
                        throw new Error(`Characteristic ${characteristicUUID} does not support write`);
                    }

                    if (!targetCharacteristic.isNotifiable && !targetCharacteristic.isIndicatable) {
                        console.warn(`Characteristic ${characteristicUUID} does not support notifications/indications`);
                    }

                    console.log('Characteristic properties:', {
                        uuid: targetCharacteristic.uuid,
                        isWritable: targetCharacteristic.isWritableWithResponse || targetCharacteristic.isWritableWithoutResponse,
                        isNotifiable: targetCharacteristic.isNotifiable,
                        isIndicatable: targetCharacteristic.isIndicatable,
                    });
                }

                setConnectedDevice(connected);
            } catch (error) {
                const errorMessage = error instanceof Error ? error.message : String(error);
                Alert.alert('Connection Failed', `Unable to connect to the device: ${errorMessage}`);
                console.error('Connection error:', error);
            }
        };

        const disconnectDevice = async () => {
            if (connectedDevice) {
                try {
                    await manager?.cancelTransaction('messageMonitor');
                    await manager?.cancelDeviceConnection(connectedDevice.id);
                    setConnectedDevice(null);
                    console.log('Device disconnected');
                    router.back();
                } catch (error) {
                    console.error('Disconnect error:', error);
                }
            }
        };

        const sendMessage = async (message: string) => {
            if (connectedDevice) {
                try {
                    if (!(await connectedDevice.isConnected())) {
                        console.log('Device not connected, reconnecting...');
                        await connectToDevice(connectedDevice);
                    }
                    await bleService.sendMessage(connectedDevice, serviceUUID, characteristicUUID, message);
                    console.log('Message sent:', message);
                } catch (error) {
                    const errorMessage = error instanceof Error ? error.message : String(error);
                    Alert.alert('Error', `Failed to send message: ${errorMessage}`);
                    console.error('Send message error:', error);
                }
            } else {
                Alert.alert('Error', 'No device connected.');
            }
        };

        const receiveMessage = (callback: (message: string) => void, enableBackgroundNotifications: boolean) => {
            if (connectedDevice) {
                try {
                    console.log('Starting characteristic monitoring...');
                    bleService.monitorMessages(connectedDevice, serviceUUID, characteristicUUID, callback, enableBackgroundNotifications);
                } catch (error) {
                    console.error('Monitor messages error:', error);
                }
            } else {
                console.warn('No device connected for monitoring');
            }
        };

        return (
            <BleContext.Provider
                value={{
                    manager,
                    devices,
                    isScanning,
                    connectedDevice,
                    startScan,
                    stopScan,
                    connectToDevice,
                    disconnectDevice,
                    sendMessage,
                    receiveMessage,
                }}
            >
                {children}
            </BleContext.Provider>
        );
    };

export const useBle = () => useContext(BleContext);