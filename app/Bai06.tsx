import { useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

const rand = () =>
    '#' + Math.floor(Math.random() * 0xffffff).toString(16).padStart(6, '0').toUpperCase();

export default function Bai06() {
    const [bg, setBg] = useState('#FFFFFF');
    return (
        <View style={[s.wrap, { backgroundColor: bg }]}>
            <View style={s.card}>
                <Text style={s.txt}>Màu hiện tại: {bg}</Text>
                <Button title="Đổi màu" onPress={() => setBg(rand())} />
            </View>
        </View>
    );
}
const s = StyleSheet.create({
    wrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    card: {
        backgroundColor: '#fff',
        padding: 20, borderRadius: 16,
        elevation: 6,
        shadowColor: '#000'
    },
    txt: {
        fontSize: 16,
        marginBottom: 12
    }
});
