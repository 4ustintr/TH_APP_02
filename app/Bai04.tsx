import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image, Linking, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function App() {
  const name = 'Trương Minh Danh';
  const job = 'Cloud Engineer';
  const email = 'danhminh2005@gmail.com';
  const phone = '0352306109';

  return (
    <SafeAreaView style={styles.screen}>
      <View style={styles.card}>
        <Image
          source={require('@/assets/images/react-logo.png')}
          style={styles.avatar}
        />

        <Text style={styles.name}>{name}</Text>
        <Text style={styles.job}>{job}</Text>

        <View style={styles.separator} />

        <Text style={styles.label}>Email</Text>
        <TouchableOpacity onPress={() => Linking.openURL(`mailto:${email}`)}>
          <Text style={styles.value}>{email}</Text>
        </TouchableOpacity>

        <Text style={[styles.label, { marginTop: 12 }]}>Số điện thoại</Text>
        <TouchableOpacity onPress={() => Linking.openURL(`tel:${phone.replace(/\s/g,'')}`)}>
          <Text style={styles.value}>{phone}</Text>
        </TouchableOpacity>
      </View>

      <StatusBar style="auto" />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: '#F4F6FB',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  card: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 28,

    // Đổ bóng (Android + iOS)
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 6 },
    shadowRadius: 12,
    elevation: 8,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    marginBottom: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: '700',
  },
  job: {
    fontSize: 16,
    color: '#556',
    marginTop: 4,
  },
  separator: {
    height: 1,
    backgroundColor: '#EEE',
    alignSelf: 'stretch',
    marginVertical: 16,
  },
  label: {
    fontSize: 12,
    color: '#889',
    letterSpacing: 0.4,
    textTransform: 'uppercase',
  },
  value: {
    fontSize: 16,
    marginTop: 4,
    fontWeight: '600',
  },
});
