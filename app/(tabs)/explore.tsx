import { View, Text, Pressable, StyleSheet, ScrollView } from 'react-native';
import { router } from 'expo-router';

export default function Explore() {
  const lessons = [
    { id: 2, title: 'Bài 2 – Xin chào React Native', path: '/Bai02' },
    { id: 3, title: 'Bài 3 – Hiển thị hình ảnh', path: '/Bai03' },
    { id: 4, title: 'Bài 4 – Thẻ thông tin cá nhân', path: '/Bai04' },
    { id: 5, title: 'Bài 5 – Tính điểm trung bình', path: '/Bai05' },
    { id: 6, title: 'Bài 6 – Đổi màu nền', path: '/Bai06' },
    { id: 7, title: 'Bài 7 – Danh sách công việc', path: '/Bai07' },
    { id: 8, title: 'Bài 8 – App 2 màn hình', path: '/Bai08' },
    { id: 9, title: 'Bài 9 – Tab Navigation', path: '/Bai09' },
    { id: 10, title: 'Bài 10 – Danh sách sinh viên', path: '/Bai10' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Danh sách bài thực hành</Text>

      {lessons.map((item) => (
        <Pressable
          key={item.id}
          style={({ pressed }) => [
            styles.button,
            pressed && { opacity: 0.7, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => router.push(item.path as never)}
        >
          <Text style={styles.text}>{item.title}</Text>
        </Pressable>
      ))}

      <Text style={styles.note}>
        👉 Nhấn vào từng bài để mở và chạy ứng dụng tương ứng.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 20,
    color: '#1a237e',
  },
  button: {
    backgroundColor: '#e3f2fd',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#90caf9',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: '#0d47a1',
  },
  note: {
    marginTop: 20,
    textAlign: 'center',
    color: '#666',
    fontStyle: 'italic',
  },
});
