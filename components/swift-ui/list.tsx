import React, { useState } from 'react';
import { View, FlatList, TouchableOpacity, TextInput, Switch, Text, useColorScheme } from 'react-native';
import { MaterialIcons, Feather } from '@expo/vector-icons';

interface ListItem {
    id?: string;
    label: string;
    value?: string;
    iconLeft?: React.ReactNode;
    iconRight?: React.ReactNode;
    type?: 'default' | 'navigation' | 'switch' | 'input' | 'action';
    onPress?: () => void;
    editable?: boolean;
    switchValue?: boolean;
    onSwitchChange?: (value: boolean) => void;
    inputValue?: string;
    inputType?: 'string' | 'number';
    inputMultiLine?: boolean;
    onInputChange?: (text: string) => void;
    onInputSubmit?: () => void;
    inputPlaceholder?: string;
    disabled?: boolean;
}

interface ListProps {
    items: ListItem[];
    title?: string;
    description?: string;
    scrollable?: boolean;
    grouped?: boolean;
    inset?: boolean;
    showDividers?: boolean;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

const List: React.FC<ListProps> = ({
    items,
    title,
    description,
    scrollable = true,
    grouped = false,
    inset = false,
    showDividers = true,
    header,
    footer,
}) => {
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editValue, setEditValue] = useState('');
    const colorScheme = useColorScheme();

    const renderItem = ({ item, index }: { item: ListItem; index: number }) => {
        const isFirst = index === 0;
        const isLast = index === items.length - 1;

        const containerClasses = [
            'flex-row items-center py-3 px-4 bg-white dark:bg-zinc-900',
            grouped && inset && 'mx-4 rounded-lg',
            isFirst && grouped && (inset ? 'rounded-t-lg' : 'rounded-t-xl'),
            isLast && grouped && (inset ? 'rounded-b-lg' : 'rounded-b-xl'),
            !grouped && showDividers && index < items.length - 1 && 'border-b border-gray-200 dark:border-zinc-800',
        ].join(' ');

        const handleEditPress = () => {
            setEditingId(item.id || null);
            setEditValue(item.value || '');
        };

        const handleEditSubmit = () => {
            if (item.onInputChange && editingId === item.id) {
                item.onInputChange(editValue);
            }
            setEditingId(null);
        };

        const handleInputSubmit = () => {
            if (item.onInputSubmit) {
                item.onInputSubmit();
            }
        };

        return (
            <TouchableOpacity
                onPress={item.onPress}
                disabled={item.disabled || item.type === 'input'}
                activeOpacity={item.type === 'navigation' || item.onPress ? 0.5 : 1}
                className={item.disabled ? 'opacity-50' : ''}
            >
                <View className={containerClasses}>
                    {item.iconLeft && <View className="mr-4">{item.iconLeft}</View>}

                    <View className="flex-1 flex-row justify-between items-center">
                        {item.type === 'input' || editingId === item.id ? (
                            <TextInput
                                className="flex-1 text-base text-black dark:text-white py-0"
                                value={editingId === item.id ? editValue : item.inputValue}
                                onChangeText={editingId === item.id ? setEditValue : item.onInputChange}
                                placeholder={item.inputPlaceholder}
                                autoFocus={editingId === item.id}
                                onSubmitEditing={handleInputSubmit} // Chamado quando o usuário pressiona submit/return
                                onBlur={handleEditSubmit}
                                editable={!item.disabled}
                                multiline={item.inputMultiLine}
                                keyboardType={item.inputType === 'number' ? 'numeric' : 'default'}
                                placeholderTextColor={colorScheme === 'dark' ? '#a1a1aa' : '#d4d4d8'}
                                returnKeyType="send"
                            />
                        ) : (
                            <Text className={`text-base ${item.disabled ? 'text-gray-400' : 'text-black dark:text-white'}`}>
                                {item.label}
                            </Text>
                        )}

                        {item.value && !editingId && item.type !== 'input' && (
                            <Text className={`text-base ${item.disabled ? 'text-gray-400' : 'text-gray-500 dark:text-gray-400'}`}>
                                {item.value}
                            </Text>
                        )}
                    </View>

                    {item.type === 'navigation' && (
                        <Feather name="chevron-right" size={20} color={colorScheme === 'dark' ? '#a1a1aa' : '#71717a'} />
                    )}

                    {item.type === 'switch' && item.onSwitchChange && (
                        <Switch
                            value={item.switchValue}
                            onValueChange={item.onSwitchChange}
                            disabled={item.disabled}
                        />
                    )}

                    {item.editable && editingId !== item.id && (
                        <TouchableOpacity onPress={handleEditPress} className="ml-2">
                            <MaterialIcons name="edit" size={20} color="#3b82f6" />
                        </TouchableOpacity>
                    )}

                    {item.iconRight && <View className="ml-2">{item.iconRight}</View>}
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View className='mt-1'>
            {title && <Text className="text-sm text-gray-500 dark:text-gray-400 px-3 mt-0 mb-0">{title}</Text>}
            <View className={`w-full my-1 ${grouped && !inset ? 'bg-white rounded-xl dark:bg-zinc-900' : ''}`}>
                {header}

                <FlatList
                    data={items}
                    renderItem={renderItem}
                    scrollEnabled={scrollable}
                    keyExtractor={(item, index) => item.id || index.toString()}
                    ListEmptyComponent={
                        <View className="py-4 items-center justify-center">
                            <Text className="text-base text-gray-500 dark:text-gray-400">Nenhum item encontrado</Text>
                        </View>
                    }
                />

                {footer}
            </View>
            {description && <Text className="text-xs text-gray-500 dark:text-gray-400 px-3 mt-1 mb-1">{description}</Text>}
        </View>
    );
};

export default List;