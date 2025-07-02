import { View, Text, FlatList, TouchableOpacity, ScrollView, RefreshControl, useColorScheme } from 'react-native';
import { Link, router } from 'expo-router';
import { useEffect, useState } from 'react';
import { useBle } from '~/contexts/BleContext';
import { usePermissions } from '~/hooks/usePermissions';
import List from '~/components/swift-ui/list';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function DevicesScreen() {
    const { devices, isScanning, startScan } = useBle();
    const permissionsGranted = usePermissions();
    const [refreshing, setRefreshing] = useState(false);
    const colorScheme = useColorScheme();

    useEffect(() => {
        if (permissionsGranted) {
            startScan();
        }
    }, [permissionsGranted, startScan]);

    const onRefresh = async () => {
        setRefreshing(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 1000)); // Aguarda 1 segundo
            await startScan(); // Inicia a busca por novos dispositivos
        } finally {
            setRefreshing(false); // Finaliza o estado de refresh
        }
    };

    return (
        <ScrollView
            className="flex h-full"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
            refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    title="Atualizando lista de dispositivos"
                    titleColor={colorScheme === 'dark' ? '#fff' : '#000'}
                    progressViewOffset={-15}
                    style={{ transform: [{ scaleX: 0.2 }, { scaleY: 0.2 }] }}
                />
            }
        >
            <View className="flex-1 p-5 gap-4">
                {permissionsGranted ? (
                    <>
                        <List
                            scrollable={false}
                            grouped
                            items={devices.map(device => ({
                                label: device.name ?? device?.id,
                                type: 'navigation',
                                iconLeft: (
                                    <Ionicons
                                        name="bluetooth"
                                        size={20}
                                        color="white"
                                        className="bg-blue-500 p-2 rounded-md"
                                    />
                                ),
                                onPress: () => router.push(`/(tabs)/(devices)/${device.id}`)
                            }))}
                            title="Found Devices"
                            description="Click on a device to view its information"
                        />
                    </>
                ) : (
                    <Text className="text-red-500">Please grant location permissions</Text>
                )}
            </View>
        </ScrollView>
    );
}