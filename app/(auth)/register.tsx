import React, { useState } from 'react';
import { View, TextInput, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '@/firebaseConfig';
import { ThemedText } from '@/components/themed-text';
import { Link, Stack } from 'expo-router';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if(!email || !password || !name) return Alert.alert("Lỗi", "Vui lòng điền đủ thông tin");
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      await updateProfile(user, { displayName: name });

      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        displayName: name,
        photoURL: user.photoURL || 'https://i.pravatar.cc/300', 
        createdAt: new Date()
      });

    } catch (error: any) {
      Alert.alert('Lỗi đăng ký', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ThemedText type="title" style={styles.title}>Create Account</ThemedText>
      <TextInput style={styles.input} placeholder="Full Name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none"/>
      <TextInput style={styles.input} placeholder="Password" value={password} onChangeText={setPassword} secureTextEntry />

      <Stack.Screen options={{ headerShown: false }} />
      
      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        <ThemedText style={{ color: 'white', fontWeight: 'bold' }}>
          {loading ? "Creating..." : "Sign Up"}
        </ThemedText>
      </TouchableOpacity>
      
      <View style={styles.footer}>
        <ThemedText>Already have an account? </ThemedText>
        <Link href="/(auth)/login">
          <ThemedText type="link">Sign In</ThemedText>
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    padding: 20, 
    backgroundColor: '#fff' 
  },
  title: { 
    textAlign: 'center', 
    marginBottom: 40 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    padding: 15, 
    borderRadius: 10, 
    marginBottom: 15, 
    backgroundColor: '#f9f9f9' 
  },
  button: { 
    backgroundColor: '#0a7ea4', 
    padding: 15, 
    borderRadius: 10, 
    alignItems: 'center' 
  },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 20 }
});