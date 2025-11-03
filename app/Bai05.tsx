import { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';

export default function Bai05() {
    const [toan, setToan] = useState('');
    const [ly, setLy] = useState('');
    const [hoa, setHoa] = useState('');
    const [kq, setKq] = useState<number | null>(null);

    const tinh = () => {
        const a = parseFloat(toan), b = parseFloat(ly), c = parseFloat(hoa);
        if ([a, b, c].some(v => Number.isNaN(v))) {
            Alert.alert('Lỗi', 'Nhập đủ 3 điểm (số).');
            return;
        }
        setKq(parseFloat(((a + b + c) / 3).toFixed(2)));
    };

    return (
        <View style={s.wrap}>
            <Text style={s.title}>Tính điểm trung bình</Text>
            <TextInput style={s.input} keyboardType="numeric" placeholder="Toán" value={toan} onChangeText={setToan} />
            <TextInput style={s.input} keyboardType="numeric" placeholder="Lý" value={ly} onChangeText={setLy} />
            <TextInput style={s.input} keyboardType="numeric" placeholder="Hóa" value={hoa} onChangeText={setHoa} />
            <Button title="Tính điểm" onPress={tinh} />
            {kq !== null && <Text style={s.kq}>Kết quả: {kq}</Text>}
        </View>
    );
}
const s = StyleSheet.create({
    wrap: { 
        flex: 1, 
        justifyContent: 'center', 
        padding: 20, 
        backgroundColor: '#fff' 
    },
    title: { 
        fontSize: 20, 
        fontWeight: '700', 
        marginBottom: 12, 
        textAlign: 'center' 
    },
    input: { 
        borderWidth: 1, 
        borderColor: '#ddd', 
        borderRadius: 8, 
        padding: 10, 
        marginBottom: 10 
    },
    kq: { 
        fontSize: 18, 
        fontWeight: '600', 
        marginTop: 20, 
        textAlign: 'center', 
        color: '#007AFF' 
    }
});
