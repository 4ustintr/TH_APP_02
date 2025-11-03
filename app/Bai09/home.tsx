import { View, Text, StyleSheet } from 'react-native';
export default function Home() {
    return (
        <View style={s.wrap}>
            <Text style={s.txt}>Home tab...</Text>
        </View>);
}
const s = StyleSheet.create({
    wrap: { flex: 1, justifyContent: 'center', alignItems: 'center' },
    txt: { fontSize: 20 }
});
