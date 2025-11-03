import { useState } from 'react';
import { View, TextInput, FlatList, Text, StyleSheet } from 'react-native';
const data = ['React', 'React Native', 'Expo', 'JavaScript', 'TypeScript'];

export default function Search(){
  const [q,setQ]=useState('');
  const items = data.filter(x=>x.toLowerCase().includes(q.toLowerCase()));
  return (
    <View style={{flex:1,padding:16}}>
      <TextInput placeholder="Tìm kiếm..." style={s.input} value={q} onChangeText={setQ}/>
      <FlatList data={items} keyExtractor={i=>i} renderItem={({item})=>(
        <Text style={s.item}>• {item}</Text>
      )}/>
    </View>
  );
}
const s = StyleSheet.create({
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10
  },
  item: {
    paddingVertical: 8,
    fontSize: 16
  }
});
