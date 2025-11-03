import { View, Text, Button, StyleSheet } from 'react-native';
import { router } from 'expo-router';

export default function Home() {
    return (
        <View style={s.wrap}>
            <Text style={s.title}>Home</Text>
            <Button title="Xem hồ sơ" onPress={() => router.push('./Bai08/profile')} />
        </View>
    );
}
const s = StyleSheet.create({
    wrap: { 
        flex: 1, 
        justifyContent: 'center', 
        alignItems: 'center' 
    },
    title: { 
        fontSize: 22, 
        fontWeight: '700', 
        marginBottom: 12 
    }
});
