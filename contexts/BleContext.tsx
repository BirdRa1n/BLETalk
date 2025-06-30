import React, { createContext, useContext, useEffect, useState } from 'react';
import { BleManager, Device } from 'react-native-ble-plx';
import { requestPermissions } from '../utils/permissions';

interface BleContextType {
    manager: BleManager | null;
    devices: Device[];
    isScanning: boolean;
    connectedDevice: Device | null;
    startScan: () => void;
    connectToDevice: (device: Device) => Promise<void>;
    disconnectDevice: () => Promise<void>;
    sendMessage: (message: string) => Promise<void>;
    receiveMessage: (callback: (message: string) => void) => void;
}

const BleContext = createContext<BleContextType>({
    manager: null,
    devices: [],
    isScanning: false,
    connectedDevice: null,
    startScan: () => { },
    connectToDevice: async () => { },
    disconnectDevice: async () => { },
    sendMessage: async () => { },
    receiveMessage: () => { },
});

export const BleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [manager] = useState(new BleManager());
    const [devices, setDevices] = useState<Device[]>([]);
    const [isScanning, setIsScanning] = useState(false);
    const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);

    useEffect(() => {
        requestPermissions().then((granted) => {
            if (!granted) {
                console.log('Permissões de Bluetooth não concedidas');
            }
        });

        return () => {
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

            setTimeout(() => {
                manager?.stopDeviceScan();
                setIsScanning(false);
            }, 10000); // Para a varredura após 10 segundos
        }
    };

    const connectToDevice = async (device: Device) => {
        try {
            await manager?.stopDeviceScan();
            const connected = await device.connect();
            setConnectedDevice(connected);
            // Configurar serviços e características conforme necessário
        } catch (error) {
            console.error('Erro ao conectar:', error);
        }
    };

    const disconnectDevice = async () => {
        if (connectedDevice) {
            await manager?.cancelDeviceConnection(connectedDevice.id);
            setConnectedDevice(null);
        }
    };

    const sendMessage = async (message: string) => {
        if (connectedDevice) {
            // Implementar lógica para enviar mensagem via BLE
            // Exemplo: await connectedDevice.writeCharacteristicForService(serviceUUID, characteristicUUID, Buffer.from(message).toString('base64'));
        }
    };

    const receiveMessage = (callback: (message: string) => void) => {
        if (connectedDevice) {
            // Implementar lógica para monitorar características e receber mensagens
            // Exemplo: manager.onCharacteristicValueChanged(characteristicUUID, (data) => callback(data));
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