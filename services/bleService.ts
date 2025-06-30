import { BleManager, Device } from 'react-native-ble-plx';
import { Buffer } from 'buffer';

export const bleService = {
    async sendMessage(device: Device, serviceUUID: string, characteristicUUID: string, message: string) {
        try {
            const connectedDevice = await device.connect();
            await connectedDevice.discoverAllServicesAndCharacteristics();
            await connectedDevice.writeCharacteristicWithResponseForService(
                serviceUUID,
                characteristicUUID,
                Buffer.from(message).toString('base64'),
            );
        } catch (error) {
            console.error('Erro ao enviar mensagem:', error);
        }
    },

    monitorMessages(device: Device, serviceUUID: string, characteristicUUID: string, callback: (message: string) => void) {
        device.monitorCharacteristicForService(serviceUUID, characteristicUUID, (error, characteristic) => {
            if (error) {
                console.error('Erro ao monitorar mensagens:', error);
                return;
            }
            if (characteristic?.value) {
                const message = Buffer.from(characteristic.value, 'base64').toString();
                callback(message);
            }
        });
    },
};