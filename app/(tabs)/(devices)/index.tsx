import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';;
import { Link, router } from 'expo-router';
import { useEffect } from 'react';
import { useBle } from '~/contexts/BleContext';
import { usePermissions } from '~/hooks/usePermissions';
import List from '~/components/swift-ui/list';
import Ionicons from '@expo/vector-icons/Ionicons';


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
                                label: device.name ?? device?.id,
                                type: 'navigation',
                                iconLeft: <Ionicons name="bluetooth" size={20} color="white" className='bg-blue-500 p-2 rounded-md' />,
                                onPress: () => router.push(`/(tabs)/(devices)/${device.id}`)
                            }))}
                            title="Found Devices"
                            description='Click on a device to view its information'
                        />
                    </>
                ) : (
                    <Text className="text-red-500">Please grant location permissions</Text>
                )}
            </View>
        </ScrollView>
    );
}