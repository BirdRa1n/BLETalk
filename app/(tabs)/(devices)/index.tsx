import { View, Text, FlatList, TouchableOpacity, ScrollView } from 'react-native';;
import { Link } from 'expo-router';
import { useEffect } from 'react';
import { useBle } from '~/contexts/BleContext';
import { usePermissions } from '~/hooks/usePermissions';

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
            className="flex h-full bg-white"
            contentInsetAdjustmentBehavior="automatic"
            showsVerticalScrollIndicator={false}
        >
            <View className="flex-1 p-4">
                <Text className="text-2xl font-bold mb-4">Dispositivos BLE</Text>
                {permissionsGranted ? (
                    <>
                        <TouchableOpacity
                            onPress={startScan}
                            disabled={isScanning}
                            className={`p-4 rounded-lg ${isScanning ? 'bg-gray-400' : 'bg-blue-500'}`}
                        >
                            <Text className="text-white text-center">
                                {isScanning ? 'Escaneando...' : 'Escanear Dispositivos'}
                            </Text>
                        </TouchableOpacity>
                        <FlatList
                            data={devices}
                            scrollEnabled={false}
                            keyExtractor={(item) => item.id}
                            renderItem={({ item }) => (
                                <Link href={`/(tabs)/${item.id}`} asChild>
                                    <TouchableOpacity className="p-4 border-b border-gray-200">
                                        <Text className="text-lg">{item.name || 'Dispositivo Desconhecido'}</Text>
                                        <Text className="text-sm text-gray-500">{item.id}</Text>
                                    </TouchableOpacity>
                                </Link>
                            )}
                        />
                    </>
                ) : (
                    <Text className="text-red-500">Permissões de Bluetooth necessárias</Text>
                )}
            </View>
        </ScrollView>
    );
}