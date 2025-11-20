import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Dimensions,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  SafeAreaView,
  Platform,
} from 'react-native';
import MapView, { Marker, Polyline, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import * as Location from 'expo-location';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_API_KEY;

const { width, height } = Dimensions.get('window');

type Coordinate = {
  latitude: number;
  longitude: number;
};

// Mock data cho các điểm giao hàng
const MOCK_DELIVERY_POINTS = [
  { id: 1, title: 'Đơn hàng #101', description: 'Giao cho anh Nam', latitude: 21.028511, longitude: 105.854444 }, // Hồ Gươm
  { id: 2, title: 'Đơn hàng #102', description: 'Giao cho chị Lan', latitude: 21.030653, longitude: 105.847130 }, // Cột cờ HN
  { id: 3, title: 'Đơn hàng #103', description: 'Giao shop quần áo', latitude: 21.036237, longitude: 105.834888 }, // Lăng Bác
];

export default function DeliveryApp() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [routeCoords, setRouteCoords] = useState<Coordinate[]>([]);
  const [isTracking, setIsTracking] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState<number | null>(null);
  
  const mapRef = useRef<MapView>(null);
  const locationSubscription = useRef<Location.LocationSubscription | null>(null);

  // Xin quyền và lấy vị trí ban đầu
  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Quyền truy cập vị trí bị từ chối!');
        return;
      }

    let currentLocation = await Location.getLastKnownPositionAsync({});
    
      setLocation(currentLocation);
    })();
    
    return () => {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
      }
    };
  }, []);

  //Tracking Mode
  useEffect(() => {
    if (isTracking) {
      startWatchingLocation();
    } else {
      if (locationSubscription.current) {
        locationSubscription.current.remove();
        locationSubscription.current = null;
      }
    }
  }, [isTracking]);

  const startWatchingLocation = async () => {
    locationSubscription.current = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.High,
        timeInterval: 5000, 
        distanceInterval: 10, 
      },
      (newLocation) => {
        setLocation(newLocation);
          // Tự động di chuyển bản đồ theo vị trí mới
        mapRef.current?.animateToRegion({
          latitude: newLocation.coords.latitude,
          longitude: newLocation.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        }, 500);
      }
    );
  };

  // Google Directions API
  const fetchDirections = async (destination: Coordinate) => {
    if (!location) return;
    

    const origin = `${location.coords.latitude},${location.coords.longitude}`;
    const dest = `${destination.latitude},${destination.longitude}`;
    const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${GOOGLE_API_KEY}`;

    try {
      const response = await fetch(url);
      const result = await response.json();

      console.log("Google API tra ve:", result);

      if (result.routes.length) {
        const points = decodePolyline(result.routes[0].overview_polyline.points);
        setRouteCoords(points);
        
        // Zoom map để thấy cả đường đi
        mapRef.current?.fitToCoordinates(points, {
          edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
          animated: true,
        });
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể lấy dữ liệu chỉ đường.");
    }
  };

  // chọn điểm giao hàng
  const onMarkerPress = (point: typeof MOCK_DELIVERY_POINTS[0]) => {
    setSelectedMarker(point.id);
    fetchDirections({ latitude: point.latitude, longitude: point.longitude });
  };

  //decode Polyline
  const decodePolyline = (t: string) => {
    let points = [];
    let index = 0, len = t.length;
    let lat = 0, lng = 0;
    while (index < len) {
      let b, shift = 0, result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lat += dlat;
      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
      lng += dlng;
      points.push({ latitude: (lat / 1E5), longitude: (lng / 1E5) });
    }
    return points;
  };

  // Màn hình Loading khi chưa lấy được vị trí
  if (!location && !errorMsg) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0a7ea4" />
        <Text style={{ marginTop: 10 }}>Đang lấy vị trí của bạn...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* Nút Back */}
      <SafeAreaView style={styles.safeHeader}>
         <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="white" />
         </TouchableOpacity>
      </SafeAreaView>

      <MapView
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        initialRegion={{
          latitude: location?.coords.latitude || 21.028511,
          longitude: location?.coords.longitude || 105.854444,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
        showsUserLocation={true} 
        showsMyLocationButton={false} 
      >
        {/* Hiển thị các điểm giao hàng */}
        {MOCK_DELIVERY_POINTS.map((point) => (
          <Marker
            key={point.id}
            coordinate={{ latitude: point.latitude, longitude: point.longitude }}
            title={point.title}
            description={point.description}
            pinColor={selectedMarker === point.id ? "red" : "navy"}
            onPress={() => onMarkerPress(point)}
          />
        ))}

        {/* Vẽ đường đi */}
        {routeCoords.length > 0 && (
          <Polyline
            coordinates={routeCoords}
            strokeWidth={4}
            strokeColor="#4285F4" 
          />
        )}
      </MapView>
      <View style={styles.panel}>
        <View style={styles.panelHeader}>
            <Text style={styles.panelTitle}>Giao hàng quanh tôi</Text>
            <View style={styles.trackingControl}>
                <Text style={styles.trackingText}>Theo dõi vị trí</Text>
                <Switch 
                    value={isTracking}
                    onValueChange={setIsTracking}
                    trackColor={{ false: "#767577", true: "#81b0ff" }}
                    thumbColor={isTracking ? "#0a7ea4" : "#f4f3f4"}
                />
            </View>
        </View>

        <View style={styles.infoBox}>
           <Ionicons name="location-sharp" size={20} color="#d32f2f" />
           <Text style={styles.infoText}>
             {selectedMarker 
               ? `Đang điều hướng tới: ${MOCK_DELIVERY_POINTS.find(p => p.id === selectedMarker)?.title}`
               : "Chọn một điểm giao hàng trên bản đồ"}
           </Text>
        </View>
        <TouchableOpacity 
            style={styles.myLocationButton}
            onPress={() => {
                if(location) {
                    mapRef.current?.animateToRegion({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                        latitudeDelta: 0.01,
                        longitudeDelta: 0.01,
                    });
                }
            }}
        >
            <Ionicons name="locate" size={24} color="#0a7ea4" />
        </TouchableOpacity>
      </View>

      {errorMsg && (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{errorMsg}</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    width: width,
    height: height,
  },
  safeHeader: {
    position: 'absolute',
    top: Platform.OS === 'android' ? 40 : 50,
    left: 20,
    zIndex: 10,
  },
  backButton: {
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 10,
    borderRadius: 20,
  },
  panel: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    paddingBottom: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  panelHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  panelTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  trackingControl: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  trackingText: {
    marginRight: 8,
    fontSize: 14,
    color: '#666',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 12,
    borderRadius: 10,
  },
  infoText: {
    marginLeft: 10,
    fontSize: 15,
    color: '#444',
    fontWeight: '500',
  },
  myLocationButton: {
    position: 'absolute',
    top: -60,
    right: 20,
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 30,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  errorContainer: {
    position: 'absolute',
    top: 100,
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 0, 0, 0.8)',
    padding: 10,
    borderRadius: 8,
  },
  errorText: {
    color: 'white',
    fontWeight: 'bold',
  },
});