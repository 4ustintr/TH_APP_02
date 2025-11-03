import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, StyleSheet, Alert } from 'react-native';

type Todo = { id: string; text: string };

export default function Bai07() {
    const [input, setInput] = useState('');
    const [todos, setTodos] = useState<Todo[]>([]);

    const add = () => {
        const t = input.trim();
        if (!t) return;
        setTodos(prev => [{ id: Date.now().toString(), text: t }, ...prev]);
        setInput('');
    };
    const remove = (id: string) => setTodos(prev => prev.filter(x => x.id !== id));

    return (
        <View style={s.wrap}>
            <Text style={s.title}>Danh sách công việc</Text>
            <View style={s.row}>
                <TextInput style={s.input} placeholder="Nhập việc..." value={input} onChangeText={setInput} />
                <Button title="Thêm" onPress={add} />
            </View>
            <FlatList
                data={todos}
                keyExtractor={i => i.id}
                renderItem={({ item }) => (
                    <Pressable
                        onLongPress={() => Alert.alert('Xóa?', 'Bạn có muốn xóa công việc này?', [
                            { text: 'Hủy' },
                            { text: 'Xóa', style: 'destructive', onPress: () => remove(item.id) }
                        ])}
                        style={s.item}
                    >
                        <Text style={s.itemTxt}>{item.text}</Text>
                        <Text style={s.delete} onPress={() => remove(item.id)}>✕</Text>
                    </Pressable>
                )}
                ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 20, color: '#999' }}>Chưa có công việc</Text>}
            />
        </View>
    );
}
const s = StyleSheet.create({
    wrap: {
        flex: 1,
        padding: 16,
        backgroundColor: '#fff'
    },
    title: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 12
    },
    row: {
        flexDirection: 'row',
        gap: 8,
        marginBottom: 12,
        alignItems: 'center'
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 10
    },
    item: {
        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
        padding: 12, borderRadius: 12, backgroundColor: '#F7F8FC', marginBottom: 8
    },
    itemTxt: {
        fontSize: 16
    },
    delete: {
        fontSize: 18,
        color: '#d33',
        paddingHorizontal: 8
    }
});
