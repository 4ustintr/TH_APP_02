import { View, Text, Switch, StyleSheet } from 'react-native';
import { useState } from 'react';
export default function Settings() {
    const [dark, setDark] = useState(false);
    return (
        <View style={s.wrap}>
            <Text style={s.txt}>Setting...</Text>
        </View>
    );
}
const s = StyleSheet.create({
    wrap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        gap: 12
    },
    txt: {
        fontSize: 18
    }
});
