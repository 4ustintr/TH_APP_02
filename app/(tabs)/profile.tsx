import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { signOut } from 'firebase/auth';
import { auth } from '@/firebaseConfig';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const user = auth.currentUser;
  const router = useRouter();

  const handleLogout = async () => {
    await signOut(auth);
    router.replace('/(auth)/login');
  };

  return (
    <View style={styles.container}>
      <Image 
        source={{ uri: user?.photoURL || 'https://i.pravatar.cc/300' }} 
        style={styles.avatar} 
      />
      <ThemedText type="title">{user?.displayName || "User"}</ThemedText>
      <ThemedText>{user?.email}</ThemedText>

      <TouchableOpacity style={styles.btn} onPress={handleLogout}>
        <ThemedText style={{color: 'white'}}>Đăng xuất</ThemedText>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#fff', 
    gap: 10 
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    marginBottom: 20 
  },
  btn: { 
    marginTop: 30, 
    backgroundColor: 'red', 
    padding: 15, 
    borderRadius: 10, 
    width: 150, 
    alignItems: 'center' 
  }
});