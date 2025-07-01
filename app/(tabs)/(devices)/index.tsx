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
            <View className="flex-1 p-5 gap-4">
                {permissionsGranted ? (
                    <>
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