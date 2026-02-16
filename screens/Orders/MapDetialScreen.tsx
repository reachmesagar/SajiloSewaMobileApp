import AntDesign from '@react-native-vector-icons/ant-design';
import { useNavigation } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import BackgroundGeolocation, {
  Subscription,
} from 'react-native-background-geolocation';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import { SafeAreaView } from 'react-native-safe-area-context';

const GOOGLE_MAPS_APIKEY = 'AIzaSyDBmR1VwADAIy08TV9gdf96Hx7g1FKESuE';

const MapTrackingScreen = () => {
  const mapRef = useRef<MapView>(null);
  const navigator = useNavigation<any>();

  const [truckLat, setTruckLat] = useState<number>(27.698141);
  const [truckLng, setTruckLng] = useState<number>(83.467698);

  const markerDestinantion = { latitude: 27.79486, longitude: 83.4552 }; //Twill be set according to the locationf receiver for now it is set lat long of baneswor

  // HandlePress
  const handleBackPress = () => {
    navigator.goBack();
  };

  // This is for the request permissions part.
  const requestLocationPermissions = async () => {
    if (Platform.OS === 'ios') {
      return true;
    }

    try {
      // STEP 1: Request Foreground (Fine) Location
      const foreground = await PermissionsAndroid.request(
        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
        {
          title: 'Sajilo Life Needs Your Location',
          message:
            'We need your location to show your delivery progress on the map.',
          buttonPositive: 'OK',
        },
      );

      if (foreground !== PermissionsAndroid.RESULTS.GRANTED) {
        Alert.alert(
          'Permission Denied',
          'Foreground location is required to track the truck.',
          [{ text: 'OK', onPress: () => navigator.goBack() }],
        );

        return false;
      }

      if (Platform.OS === 'android' && Platform.Version >= 29) {
        // It is best practice to show a rationale before the background prompt
        const background = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_BACKGROUND_LOCATION,
        );
        if (background !== PermissionsAndroid.RESULTS.GRANTED) {
          Alert.alert(
            'Note',
            'Background tracking is disabled. The app must stay open to track.',
          );
        }
      }
      return true;
    } catch (err) {
      console.warn(err);
      return false;
    }
  };

  useEffect(() => {
    const setupTracking = async () => {
      const hasPermission = await requestLocationPermissions();
      if (!hasPermission) return;

      // 1. Listen for location updates
      const onLocation: Subscription = BackgroundGeolocation.onLocation(
        location => {
          console.log(
            '[Location Received]',
            location.coords.latitude,
            location.coords.longitude,
          );

          setTruckLat(location.coords.latitude);
          setTruckLng(location.coords.longitude);
        },
      );

      // 2. Initialize the native background service
      BackgroundGeolocation.ready({
        desiredAccuracy: BackgroundGeolocation.DesiredAccuracy.High,
        distanceFilter: 10, // Minimum meters to move before update
        stopOnTerminate: false, // Keep tracking if app is closed
        startOnBoot: true, // Restart tracking on phone reboot
        debug: true, // Beeps when location is updated
        logLevel: BackgroundGeolocation.LogLevel.Info,
        // URL is omitted for local-only testing
      }).then(state => {
        if (!state.enabled) {
          BackgroundGeolocation.start(); // Begin tracking
        }
      });

      return () => {
        onLocation.remove();
      };
    };

    setupTracking();
  }, []);

  // This render the directions for the map
  const RenderDirections = useCallback(
    () => (
      <MapViewDirections
        origin={{
          latitude: truckLat,
          longitude: truckLng,
        }}
        destination={markerDestinantion}
        apikey={GOOGLE_MAPS_APIKEY}
        strokeWidth={4}
        strokeColor="#007AFF"
        optimizeWaypoints={true}
        resetOnChange={false}
        onReady={result => {
          mapRef.current?.fitToCoordinates(result.coordinates, {
            edgePadding: { right: 50, bottom: 50, left: 50, top: 100 },
          });
        }}
      />
    ),
    [],
  );

  return (
    <View style={styles.mainContainer}>
      <MapView
        ref={mapRef}
        provider={Platform.OS === 'android' ? PROVIDER_GOOGLE : undefined}
        style={styles.map}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor="transparent"
          translucent
        />
        {/* Path stays static (No Blinking) */}
        {RenderDirections()}

        {/* Truck moves independently */}
        <Marker
          coordinate={{ latitude: truckLat, longitude: truckLng }}
          tracksViewChanges={false} // Prevents icon flickering
        >
          <View style={styles.markerWrapper}>
            <View />
            <View style={styles.truckIconBox}>
              <Text style={{ fontSize: 20 }}>🚚</Text>
            </View>
          </View>
        </Marker>

        <Marker coordinate={markerDestinantion} tracksViewChanges={false}>
          <View style={styles.homeMarker}>
            <AntDesign name="home" size={20} color="#007AFF" />
          </View>
        </Marker>
      </MapView>

      <SafeAreaView style={styles.overlayUI} pointerEvents="box-none">
        <View style={styles.topBar}>
          <TouchableOpacity style={styles.iconButton} onPress={handleBackPress}>
            <AntDesign name="left" color="#000" size={20} />
          </TouchableOpacity>
          <View style={styles.glassHeader}>
            <Text style={styles.statusLabel}>TRACKING SHIPMENT</Text>
            <Text style={styles.statusValue}>En Route</Text>
          </View>
        </View>
        <View style={styles.bottomCard}>
          <View style={styles.driverRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>JD</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.driverName}>John Driver</Text>
              <Text style={styles.subText}>White Toyota Prius • ABC-1234</Text>
            </View>
            <TouchableOpacity style={styles.callButton}>
              <AntDesign name="phone" size={20} color="#FFF" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: '#E5E5E5' },
  map: { ...StyleSheet.absoluteFillObject },
  overlayUI: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
  },
  topBar: { flexDirection: 'row', padding: 20, alignItems: 'center' },
  iconButton: {
    backgroundColor: '#FFF',
    padding: 12,
    borderRadius: 16,
    elevation: 5,
  },
  glassHeader: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.9)',
    marginLeft: 15,
    padding: 12,
    borderRadius: 16,
  },
  statusLabel: { fontSize: 10, fontWeight: '800', color: '#007AFF' },
  statusValue: { fontSize: 16, fontWeight: '600' },
  bottomCard: {
    backgroundColor: '#FFF',
    margin: 20,
    padding: 20,
    borderRadius: 28,
    elevation: 10,
  },
  driverRow: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  avatarText: { fontWeight: 'bold', color: '#007AFF' },
  driverName: { fontSize: 18, fontWeight: '700', color: '#1C1C1E' },
  subText: { fontSize: 13, color: '#8E8E93' },
  callButton: { backgroundColor: '#34C759', padding: 12, borderRadius: 25 },
  markerWrapper: { alignItems: 'center', justifyContent: 'center' },
  truckIconBox: {
    backgroundColor: '#FFF',
    padding: 5,
    borderRadius: 20,
    elevation: 5,
  },
  homeMarker: {
    backgroundColor: '#FFF',
    padding: 8,
    borderRadius: 20,
    elevation: 5,
    borderWidth: 2,
    borderColor: '#007AFF',
  },
});

export default MapTrackingScreen;
