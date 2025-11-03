import { View, Text, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

export default function Detail() {
    const params = useLocalSearchParams<{ id: string; name: string; major: string; }>();
    return (
        <View style={s.wrap}>
            <Text style={s.title}>{params.name}</Text>
            <Text>Mã ID: {params.id}</Text>
            <Text>Ngành: {params.major}</Text>
        </View>
    );
}
const s = StyleSheet.create({
    wrap: { flex: 1, justifyContent: 'center', alignItems: 'center', gap: 8 },
    title: { fontSize: 20, fontWeight: '700' }
});
