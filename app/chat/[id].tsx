import React, { useState, useEffect, useCallback } from 'react';
import { GiftedChat, IMessage, Send, Bubble } from 'react-native-gifted-chat';
import { collection, addDoc, orderBy, query, onSnapshot, where, or, and } from 'firebase/firestore';
import { auth, db, storage } from '@/firebaseConfig';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { View, ActivityIndicator, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Ionicons } from '@expo/vector-icons';

export default function ChatScreen() {
  const [messages, setMessages] = useState<IMessage[]>([]);
  const { id: receiverId, name } = useLocalSearchParams(); 
  const navigation = useNavigation();
  const currentUser = auth.currentUser;

  useEffect(() => {
    navigation.setOptions({ title: name || 'Chat' });
  }, [name]);

  useEffect(() => {
    if (!currentUser) return;

    // Tạo ID phòng chat duy nhất giữa 2 người (để query tin nhắn của 2 người này thôi)
    const chatId = [currentUser.uid, receiverId].sort().join('_');
    const messagesRef = collection(db, 'rooms', chatId, 'messages');
    
    const q = query(messagesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const allMessages = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          _id: doc.id,
          text: data.text,
          createdAt: data.createdAt.toDate(),
          user: data.user,
          image: data.image || null,
        };
      });
      setMessages(allMessages);
    });

    return () => unsubscribe();
  }, [receiverId]);

  const onSend = useCallback(async (messages: IMessage[] = []) => {
    const { _id, createdAt, text, user, image } = messages[0];
    const chatId = [currentUser?.uid, receiverId].sort().join('_');

    await addDoc(collection(db, 'rooms', chatId, 'messages'), {
      _id,
      createdAt,
      text: text || '',
      user,
      image: image || null,
      senderId: currentUser?.uid,
      receiverId: receiverId,
    });
  }, [receiverId]);

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });

    if (!result.canceled) {
      uploadImage(result.assets[0].uri);
    }
  };

  const uploadImage = async (uri: string) => {
    if (!currentUser) return;
    try {
      const response = await fetch(uri);
      const blob = await response.blob();
      
      const filename = uri.substring(uri.lastIndexOf('/') + 1);
      const storageRef = ref(storage, `images/${filename}`);
      
      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const message: IMessage = {
        _id: Math.random().toString(),
        createdAt: new Date(),
        user: {
          _id: currentUser.uid,
          avatar: currentUser.photoURL || '',
        },
        image: downloadURL,
        text: '',
      };
      onSend([message]);
      
    } catch (error) {
      Alert.alert("Lỗi upload", "Không thể gửi ảnh");
    }
  };

  const renderActions = (props: any) => (
    <Ionicons 
      name="image" 
      size={28} 
      color="#0a7ea4" 
      style={{ marginLeft: 10, marginBottom: 10 }} 
      onPress={pickImage}
    />
  );

  return (
    <GiftedChat
      messages={messages}
      onSend={messages => onSend(messages)}
      user={{
        _id: currentUser?.uid || '',
        name: currentUser?.displayName || '',
        avatar: currentUser?.photoURL || '',
      }}
      renderActions={renderActions}
      renderBubble={props => (
        <Bubble
          {...props}
          wrapperStyle={{
            right: { backgroundColor: '#0a7ea4' },
          }}
        />
      )}
    />
  );
}