import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';;
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { useBle } from '~/contexts/BleContext';
import { usePermissions } from '~/hooks/usePermissions';
import List from '~/components/swift-ui/list';

export default function DevicesScreen() {
    const { devices, isScanning, startScan } = useBle();
    const permissionsGranted = usePermissions();

    useEffect(() => {
        if (permissionsGranted) {
            startScan();
        }
    }, [permissionsGranted, startScan]);

    return (
        <ScrollView
            className="flex h-full"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}

        >
            <View className="flex-1 p-4">
                {permissionsGranted ? (
                    <>
                        <TouchableOpacity
                            onPress={startScan}
                            disabled={isScanning}
                            className={`p-4 rounded-lg ${isScanning ? 'bg-gray-400 dark:bg-zinc-900' : 'bg-blue-500'}`}
                        >
                            <Text className="text-white text-center">
                                {isScanning ? 'Escaneando...' : 'Escanear Dispositivos'}
                            </Text>
                        </TouchableOpacity>
                        <List
                            scrollable={false}
                            grouped
                            items={devices.map(device => ({
                                label: device.name ?? 'Dispositivo sem nome',
                                type: 'navigation',
                                onPress: () => router.push(`/(tabs)/(devices)/${device.id}`)
                            }))}
                            title="Dispositivos Encontrados"
                            description='Clique em um dispositivo para ver suas informações'
                        />
                    </>
                ) : (
                    <Text className="text-red-500">Permissões de Bluetooth necessárias</Text>
                )}
            </View>
        </ScrollView>
    );
}