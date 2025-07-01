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
            <Stack.Screen options={{ title: 'Device' }} />
            {connectedDevice?.id === device?.id ? (
                <>
                    <List
                        grouped
                        scrollable={false}
                        showDividers={true}
                        title='Device Information'
                        description='Information about the connected device'
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
                                label: 'Notifications',
                                type: 'switch',
                                switchValue: enableBackgroundNotifications,
                                onSwitchChange: (value) => setEnableBackgroundNotifications(value),
                            }
                        ]}
                    />
                    <List
                        grouped
                        title='Send Message'
                        showDividers={true}
                        scrollable={false}
                        items={[
                            {
                                label: 'Message',
                                type: 'input',
                                inputMultiLine: true,
                                inputPlaceholder: 'Type your message here...',
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
                        <Text className="text-black text-center dark:text-white">Send Message</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        onPress={disconnectDevice}
                        className="p-4 bg-red-500 rounded-xl mt-2"
                    >
                        <Text className="text-white text-center">Disconnect</Text>
                    </TouchableOpacity>
                </>
            ) : (
                <>
                    <List
                        grouped
                        showDividers={true}
                        scrollable={false}
                        title='Device Information'
                        description='Information about the connected device. Select to connect or send messages.'
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
                        <Text className="text-gray-600 dark:text-white text-center">Connect</Text>
                    </TouchableOpacity>
                </>
            )}

            {receivedMessages.length > 0 && (
                <List
                    showDividers
                    grouped
                    scrollable={false}
                    title='Received Messages'
                    items={receivedMessages.map((msg, index) => ({
                        label: `Message ${index + 1}`,
                        value: msg
                    }))}
                />
            )}
        </ScrollView>
    );
}