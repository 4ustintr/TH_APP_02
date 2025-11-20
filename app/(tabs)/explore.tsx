import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image } from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons'; // Sử dụng icon từ thư viện có sẵn của Expo

export default function ExploreScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Khám phá</Text>
          <Text style={styles.headerSubtitle}>Các ứng dụng & tính năng demo</Text>
        </View>

        <TouchableOpacity 
          style={styles.card} 
          onPress={() => router.push('../Delivery')} 
          activeOpacity={0.8}
        >
          <View style={[styles.iconContainer, { backgroundColor: '#e3f2fd' }]}>
            <Ionicons name="map" size={32} color="#0a7ea4" />
          </View>
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle}>Giao hàng quanh tôi</Text>
            <Text style={styles.cardDescription}>
              Bản đồ Google Map, định vị GPS, vẽ đường đi và Marker ảo.
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#ccc" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    marginBottom: 24,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#1a1a1a',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2, 
    borderWidth: 1,
    borderColor: '#f0f0f0',
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardContent: {
    flex: 1,
    marginRight: 8,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#333',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#888',
    lineHeight: 18,
  },
});