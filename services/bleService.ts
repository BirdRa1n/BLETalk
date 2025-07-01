import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';
import * as Notifications from 'expo-notifications';
import { AppState } from 'react-native';

export const bleService = {
    async sendMessage(device: Device, serviceUUID: string, characteristicUUID: string, message: string) {
        try {
            let connectedDevice = device;
            if (!(await device.isConnected())) {
                console.log('Device not connected, attempting to reconnect');
                connectedDevice = await device.connect();
                await connectedDevice.discoverAllServicesAndCharacteristics();
            }
            const characteristics = await connectedDevice.characteristicsForService(serviceUUID);
            const targetCharacteristic = characteristics.find((c) => c.uuid === characteristicUUID);
            if (!targetCharacteristic) {
                throw new Error(`Characteristic ${characteristicUUID} not found`);
            }
            if (!targetCharacteristic.isWritableWithResponse && !targetCharacteristic.isWritableWithoutResponse) {
                throw new Error(`Characteristic ${characteristicUUID} does not support write`);
            }
            await connectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                characteristicUUID,
                Buffer.from(message).toString('base64'),
            );
            console.log('Message sent successfully:', message);
        } catch (error) {
            if (error instanceof Error) {
                throw new Error(`Failed to send message: ${error.message}`);
            } else {
                throw new Error('Failed to send message: Unknown error');
            }
        }
    },

    monitorMessages(device: Device, serviceUUID: string, characteristicUUID: string, callback: (message: string) => void, enableBackgroundNotifications: boolean) {
        try {
            device.monitorCharacteristicForService(serviceUUID, characteristicUUID, async (error, characteristic) => {
                if (error) {
                    if (error.message.includes('disconnected') || error.message.includes('cancelled')) {
                        console.log('Monitoring stopped due to disconnection or cancellation');
                        return;
                    }
                    console.error('Error monitoring messages:', error);
                    return;
                }
                if (characteristic?.value) {
                    const message = Buffer.from(characteristic.value, 'base64').toString();
                    callback(message);
                    if (enableBackgroundNotifications && AppState.currentState !== 'active') {
                        try {
                            await Notifications.scheduleNotificationAsync({
                                content: {
                                    title: 'BLETalk',
                                    body: message,
                                    data: { message },
                                },
                                trigger: null, // Immediate notification
                            });
                            console.log('Local notification scheduled for message:', message);
                        } catch (error) {
                            console.error('Failed to schedule local notification:', error);
                        }
                    }
                }
            }, 'messageMonitor');
        } catch (error) {
            console.error('Monitor setup error:', error);
            throw error;
        }
    },
};