import React, { useEffect, useState } from 'react';
import { View, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { collection, onSnapshot, query, where } from 'firebase/firestore';
import { db, auth } from '@/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { useRouter } from 'expo-router';

export default function ChatListScreen() {
  const [users, setUsers] = useState<any[]>([]);
  const router = useRouter();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(collection(db, 'users'), where('uid', '!=', auth.currentUser.uid));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const userList = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setUsers(userList);
    });

    return unsubscribe;
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={users}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.userCard} 
            onPress={() => router.push({ pathname: '/chat/[id]', params: { id: item.uid, name: item.displayName } })}
          >
            <Image source={{ uri: item.photoURL }} style={styles.avatar} />
            <View style={styles.info}>
              <ThemedText type="defaultSemiBold">{item.displayName}</ThemedText>
              <ThemedText style={{ color: 'gray', fontSize: 12 }}>Tap to chat</ThemedText>
            </View>
            <View style={styles.statusDot} />
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  userCard: { 
    flexDirection: 'row', 
    padding: 15, 
    alignItems: 'center', 
    borderBottomWidth: 0.5, 
    borderBottomColor: '#eee' 
  },
  avatar: { 
    width: 50, 
    height: 50, 
    borderRadius: 25, 
    backgroundColor: '#ddd' 
  },
  info: { 
    marginLeft: 15, 
    flex: 1 
  },
  statusDot: { 
    width: 10, 
    height: 10, 
    borderRadius: 5, 
    backgroundColor: 'green' 
  }
});