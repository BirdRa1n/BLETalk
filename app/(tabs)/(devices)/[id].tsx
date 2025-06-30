import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { useBle } from '~/contexts/BleContext';

export default function DeviceScreen() {
    const { id } = useLocalSearchParams();
    const { devices, connectedDevice, connectToDevice, disconnectDevice, sendMessage, receiveMessage } = useBle();
    const device = devices.find((d) => d.id === id);
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

    useEffect(() => {
        if (device && !connectedDevice) {
            connectToDevice(device);
        }
        receiveMessage((msg) => setReceivedMessages((prev) => [...prev, msg]));
    }, [device, connectedDevice, connectToDevice, receiveMessage]);

    const handleSendMessage = () => {
        sendMessage(message);
        setMessage('');
    };

    return (
        <View className="flex-1 p-4 bg-white">
            <Text className="text-2xl font-bold mb-4">{device?.name || 'Dispositivo'}</Text>
            <Text className="text-sm mb-4">
                Status: {connectedDevice?.id === device?.id ? 'Conectado' : 'Desconectado'}
            </Text>
            <TextInput
                value={message}
                onChangeText={setMessage}
                placeholder="Digite uma mensagem"
                className="p-2 border border-gray-300 rounded mb-4"
            />
            <TouchableOpacity
                onPress={handleSendMessage}
                className="p-4 bg-blue-500 rounded"
            >
                <Text className="text-white text-center">Enviar Mensagem</Text>
            </TouchableOpacity>
            <TouchableOpacity
                onPress={disconnectDevice}
                className="p-4 bg-red-500 rounded mt-2"
            >
                <Text className="text-white text-center">Desconectar</Text>
            </TouchableOpacity>
            <Text className="text-lg font-bold mt-4">Mensagens Recebidas:</Text>
            {receivedMessages.map((msg, index) => (
                <Text key={index} className="text-sm">{msg}</Text>
            ))}
        </View>
    );
}