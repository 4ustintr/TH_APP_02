import { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

type SV = { id: string; name: string; major: string };

export default function List() {
    const [name, setName] = useState(''); const [major, setMajor] = useState('');
    const [data, setData] = useState<SV[]>([
        { id: '1', name: 'Lê Hữu Chính', major: 'CNTT' },
        { id: '2', name: 'Trần Tuấn Minh', major: 'AI' },
    ]);

    const add = () => {
        if (!name.trim() || !major.trim()) return;
        setData(prev => [{ id: Date.now().toString(), name: name.trim(), major: major.trim() }, ...prev]);
        setName(''); setMajor('');
    };

    return (
        <View style={{ flex: 1, padding: 16 }}>
            <Text style={s.h}>Thêm sinh viên</Text>
            <TextInput placeholder="Họ tên" style={s.inp} value={name} onChangeText={setName} />
            <TextInput placeholder="Ngành" style={s.inp} value={major} onChangeText={setMajor} />
            <Button title="Thêm" onPress={add} />
            <FlatList
                style={{ marginTop: 16 }}
                data={data} keyExtractor={i => i.id}
                renderItem={({ item }) => (
                    <Pressable style={s.item} onPress={() => router.push({ pathname: '/Bai10/detail', params: item })}>
                        <Text style={s.name}>{item.name}</Text>
                        <Text>{item.major}</Text>
                    </Pressable>
                )}
            />
        </View>
    );
}
const s = StyleSheet.create({
    h: { fontSize: 18, fontWeight: '700', marginBottom: 8 },
    inp: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 10, marginBottom: 8 },
    item: { padding: 12, backgroundColor: '#F7F8FC', borderRadius: 12, marginBottom: 8 },
    name: { fontWeight: '700' }
});
