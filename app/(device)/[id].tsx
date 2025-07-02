import { View, Text, TextInput, TouchableOpacity, ScrollView, AppState, KeyboardAvoidingView, Platform } from 'react-native';
import { Stack, useLocalSearchParams } from 'expo-router';
import { useEffect, useState, useCallback, useRef } from 'react';
import { useBle } from '~/contexts/BleContext';
import List from '~/components/swift-ui/list';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function DeviceScreen() {
    const { id } = useLocalSearchParams();
    const { devices, connectedDevice, connectToDevice, disconnectDevice, sendMessage, receiveMessage } = useBle();
    const device = devices.find((d) => d.id === id);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState<{ text: string; isSent: boolean }[]>([]);
    const [lastSentMessage, setLastSentMessage] = useState<string | null>(null);
    const [enableBackgroundNotifications, setEnableBackgroundNotifications] = useState(false);
    const scrollViewRef = useRef<ScrollView>(null);
    const { bottom, top } = useSafeAreaInsets();

    const handleMessageReceived = useCallback(
        (msg: string) => {
            const formattedMsg = lastSentMessage ? `received:${lastSentMessage}` : msg;
            setMessages((prev) => [...prev, { text: formattedMsg, isSent: false }]);
            // Scroll to the bottom when a new message is received
            scrollViewRef.current?.scrollToEnd({ animated: true });
        },
        [lastSentMessage]
    );

    useEffect(() => {
        // Configure message monitoring when connected
        if (connectedDevice) {
            receiveMessage((msg) => handleMessageReceived(msg), enableBackgroundNotifications);
        }
    }, [connectedDevice, receiveMessage, handleMessageReceived, enableBackgroundNotifications]);

    const handleSendMessage = () => {
        if (message.trim()) {
            sendMessage(message);
            setMessages((prev) => [...prev, { text: message, isSent: true }]);
            setLastSentMessage(message);
            setMessage('');
            // Scroll to the bottom when a new message is sent
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }
    };

    const handleConnect = () => {
        if (device) {
            connectToDevice(device);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            keyboardVerticalOffset={Platform.OS === 'ios' ? top + 20 : 0}
            style={{ flex: 1 }}
        >
            <View className="flex-1">
                <ScrollView
                    ref={scrollViewRef}
                    className="flex-1 p-5"
                    contentInsetAdjustmentBehavior="automatic"
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={{ paddingBottom: bottom + 20 }}
                >
                    <Stack.Screen options={{ title: 'Device' }} />
                    {connectedDevice?.id === device?.id ? (
                        <>
                            <List
                                grouped
                                scrollable={false}
                                showDividers={true}
                                title="Device Information"
                                description="Information about the connected device"
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
                                    },
                                ]}
                            />
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
                                title="Device Information"
                                description="Information about the connected device. Select to connect or send messages."
                                items={[
                                    {
                                        label: 'Name',
                                        value: device?.name || '',
                                    },
                                    {
                                        label: 'UUID',
                                        value: device?.id || '',
                                    },
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

                    {messages.length > 0 && (
                        <View className="mt-4">
                            {messages.map((msg, index) => (
                                <View
                                    key={index}
                                    className={`mb-2 p-3 rounded-xl max-w-[80%] ${msg.isSent
                                        ? 'bg-blue-500 self-end'
                                        : 'bg-gray-200 dark:bg-zinc-700 self-start'
                                        }`}
                                >
                                    <Text
                                        className={`text-base ${msg.isSent ? 'text-white' : 'text-black dark:text-white'
                                            }`}
                                    >
                                        {msg.text}
                                    </Text>
                                </View>
                            ))}
                        </View>
                    )}
                    {/* Spacer to ensure content is not hidden behind the input */}
                    <View className="h-20" />
                </ScrollView>

                {connectedDevice?.id === device?.id && (
                    <View
                        className="bg-white dark:bg-zinc-900 p-4 border-t border-gray-200 dark:border-zinc-700"
                        style={{ paddingBottom: bottom }}
                    >
                        <View className="flex-row items-center">
                            <TextInput
                                className="flex-1 p-3 bg-gray-100 dark:bg-zinc-800 rounded-xl text-black dark:text-white"
                                placeholder="Type your message here..."
                                placeholderTextColor="#999"
                                value={message}
                                onChangeText={setMessage}
                                multiline
                                onSubmitEditing={handleSendMessage}
                            />
                            <TouchableOpacity
                                onPress={handleSendMessage}
                                className="ml-2 p-3"
                                disabled={!message.trim()}
                            >
                                <Ionicons
                                    name="send"
                                    size={20}
                                    color={'#999'}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            </View>
        </KeyboardAvoidingView>
    );
}