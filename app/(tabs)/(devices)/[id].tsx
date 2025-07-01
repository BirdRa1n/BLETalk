import { View, Text, TextInput, TouchableOpacity, ScrollView, AppState } from 'react-native';
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
    const [enableBackgroundNotifications, setEnableBackgroundNotifications] = useState(false);

    const handleMessageReceived = useCallback((msg: string) => {
        setReceivedMessages((prev) => [...prev, msg]);
    }, []);

    useEffect(() => {
        // Configure message monitoring when connected
        if (connectedDevice) {
            receiveMessage((msg) => handleMessageReceived(msg), enableBackgroundNotifications);
        }
    }, [connectedDevice, receiveMessage, handleMessageReceived, enableBackgroundNotifications]);

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
                        scrollable={false}
                        showDividers={true}
                        title='Informações do Dispositivo'
                        description='Informações do dispositivo conectado'
                        items={[
                            {
                                label: 'Name',
                                value: connectedDevice?.name || '',
                            },
                            {
                                label: 'UUID',
                                value: connectedDevice?.id || '',
                            },
                            {
                                label: 'Notificações',
                                type: 'switch',
                                switchValue: enableBackgroundNotifications,
                                onSwitchChange: (value) => setEnableBackgroundNotifications(value),
                            }
                        ]}
                    />
                    <List
                        grouped
                        title='Mensagens'
                        showDividers={true}
                        scrollable={false}
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
                        ]}
                    />
                    <TouchableOpacity
                        onPress={handleSendMessage}
                        className="p-4 bg-white rounded-xl mt-1 dark:bg-zinc-900 items-center"
                    >
                        <Text className="text-black text-center dark:text-white">Enviar Mensagem</Text>
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
                        title='Informações do Dispositivo'
                        showDividers={true}
                        scrollable={false}
                        description='Informações do dispositivo conectado. Selecione para conectar ou enviar mensagens.'
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
                        className="p-4 bg-white rounded-xl mt-1 dark:bg-zinc-900 items-center"
                    >
                        <Text className="text-gray-600 dark:text-white text-center">Conectar</Text>
                    </TouchableOpacity>
                </>
            )}

            {receivedMessages.length > 0 && (
                <List
                    showDividers
                    grouped
                    scrollable={false}
                    title='Mensagens'
                    items={receivedMessages.map((msg, index) => ({
                        label: `Mensagem ${index + 1}`,
                        value: msg
                    }))}
                />
            )}
        </ScrollView>
    );
}