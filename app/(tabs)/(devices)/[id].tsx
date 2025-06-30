import { View, Text, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback } from 'react';
import { useBle } from '~/contexts/BleContext';
import List from '~/components/swift-ui/list';

export default function DeviceScreen() {
    const { id } = useLocalSearchParams();
    const { devices, connectedDevice, connectToDevice, disconnectDevice, sendMessage, receiveMessage } = useBle();
    const device = devices.find((d) => d.id === id);
    const [message, setMessage] = useState('');
    const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

    const handleMessageReceived = useCallback((msg: string) => {
        setReceivedMessages((prev) => [...prev, msg]);
    }, []);

    useEffect(() => {
        // Configurar monitoramento de mensagens apenas quando conectado
        if (connectedDevice) {
            receiveMessage(handleMessageReceived);
        }
    }, [connectedDevice, receiveMessage, handleMessageReceived]);

    const handleSendMessage = () => {
        sendMessage(message);
        setMessage('');
    };

    const handleConnect = () => {
        if (device) {
            connectToDevice(device);
        }
    };

    return (
        <ScrollView
            className="flex h-screen p-5"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
        >
            <Stack.Screen options={{ title: 'Dispositivo' }} />
            {connectedDevice?.id === device?.id ? (
                <>
                    <List
                        grouped
                        showDividers={true}
                        title='Informações do Dispositivo'
                        description='Informações do dispositivo conectado'
                        items={[
                            {
                                label: 'Name',
                                value: connectedDevice?.name || '',
                            },
                            {
                                label: 'UUID',
                                value: connectedDevice?.id || '',
                            }
                        ]} />
                    <List
                        grouped
                        title='Mensagens'
                        showDividers={true}
                        items={[

                            {
                                label: 'Mensagem',
                                type: 'input',
                                inputMultiLine: true,
                                inputPlaceholder: 'Digite sua mensagem',
                                inputValue: message,
                                onInputChange: (text) => setMessage(text),
                                onInputSubmit: () => handleSendMessage(),
                            }
                        ]} />

                    <TouchableOpacity
                        onPress={handleSendMessage}
                        className="p-4 bg-white rounded-xl mt-5 dark:bg-zinc-900 items-center"
                    >
                        <Text className="text-white text-center">Enviar Mensagem</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={disconnectDevice}
                        className="p-4 bg-red-500 rounded-xl mt-2"
                    >
                        <Text className="text-white text-center">Desconectar</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <List
                        grouped
                        title='Informações do Dispositivo'
                        showDividers={true}
                        description='Informações do dispositivo conectado'
                        items={[
                            {
                                label: 'Name',
                                value: device?.name || '',
                            },
                            {
                                label: 'UUID',
                                value: device?.id || '',
                            }
                        ]}
                    />
                    <TouchableOpacity
                        onPress={handleConnect}
                        className="p-4 bg-white rounded-xl mt-5 dark:bg-zinc-900 items-center"
                    >
                        <Text className="text-white text-center">Conectar</Text>
                    </TouchableOpacity>
                </>
            )}

            {
                receiveMessage.length > 0 && (
                    <List
                        showDividers
                        grouped
                        title='Mensagens'
                        items={receivedMessages.map((msg, index) => ({
                            label: `Mensagem ${index + 1}`,
                            value: msg
                        }))}
                    />
                )
            }

            <Text className="text-lg font-bold mt-4">Mensagens Recebidas:</Text>
            {receivedMessages.map((msg, index) => (
                <Text key={index} className="text-sm">{msg}</Text>
            ))}
        </ScrollView>
    );
}