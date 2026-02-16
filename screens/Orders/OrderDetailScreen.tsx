import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
// import { database } from '../../models';
// import Order from '../../models/Order';

// Reuse our Type Safety
interface Order {
  order_id: string;
  sender_name: string;
  recipient_name: string;
  is_delivered: boolean;
  sender_address: string;
  recipient_address?: string;
  sender_contact?: string;
  recipient_contact?: string;
}







export const OrderDetailScreen = ({ route }: any) => {
  // In a real app, you'd pass this via navigation
  const order: Order = {
    order_id: 'ORD-7721-X',
    sender_name: 'Alice Thompson',
    recipient_name: 'Marcus Holloway',
    is_delivered: true,
    sender_address: '123 Maple Street, Springfield',
    recipient_address: '456 Oak Avenue, Shelbyville',
    sender_contact: '+1 555-1234',
    recipient_contact: '+1 555-5678',
  };

  const navigator = useNavigation<any>();
  const handleNavigation = () => {
    navigator.navigate('MapTrackingScreen');
  };

  // const trips = async () => {
  //   let r = await database.get<Order>('trips').query().fetch();
  //   console.log(r);
  // };

  // trips()

  return (
    <View style={styles.container}>
      {/* 1. Hero Image Section */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: 'https://www.shutterstock.com/image-vector/dark-black-tirana-city-area-600nw-2079579424.jpg',
          }}
          style={styles.heroImage}
        />
        <View style={styles.imageOverlay} />
      </View>

      {/* 2. Content Card */}
      <View
        style={styles.scrollView}
        // showsVerticalScrollIndicator={false}
      >
        <View style={styles.contentCard}>
          <View style={styles.headerRow}>
            <Text style={styles.orderIdLabel}>Order {order.order_id}</Text>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: order.is_delivered ? '#E8F5E9' : '#FFF3E0' },
              ]}
            >
              <Text
                style={[
                  styles.statusText,
                  { color: order.is_delivered ? '#2E7D32' : '#EF6C00' },
                ]}
              >
                {order.is_delivered ? 'Delivered' : 'In Transit'}
              </Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>Delivery Details</Text>

          {/* Sender & Recipient Logic */}
          <View style={styles.infoRow}>
            <View style={styles.iconCircle}>
              <Text>📤</Text>
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.label}>Sender</Text>
              <Text style={styles.value}>{order.sender_name}</Text>
              <Text style={styles.label}>{order.sender_address}</Text>
              {order.sender_contact && (
                <Text style={styles.label}>{order.sender_contact}</Text>
              )}
            </View>
          </View>

          <View style={styles.verticalLine} />

          <View style={styles.infoRow}>
            <View style={[styles.iconCircle, { backgroundColor: '#E3F2FD' }]}>
              <Text>📥</Text>
            </View>
            <View style={styles.textGroup}>
              <Text style={styles.label}>Recipient</Text>
              <Text style={styles.value}>{order.recipient_name}</Text>
              <Text style={styles.label}>{order.recipient_address}</Text>
              {order.recipient_contact && (
                <Text style={styles.label}>{order.recipient_contact}</Text>
              )}
            </View>
          </View>

          {/* 3. Visual Timeline / Progress */}
          <View style={styles.timelineContainer}>
            <Text style={styles.sectionTitle}>Current Status</Text>
            <View style={styles.progressTrack}>
              <View style={[styles.dot, { backgroundColor: '#007AFF' }]} />
              <View
                style={[
                  styles.line,
                  {
                    backgroundColor: order.is_delivered ? '#007AFF' : '#E0E0E0',
                  },
                ]}
              />
              <View
                style={[
                  styles.dot,
                  {
                    backgroundColor: order.is_delivered ? '#007AFF' : '#E0E0E0',
                  },
                ]}
              />
            </View>
            <View style={styles.progressLabels}>
              <Text style={styles.progressText}>Processed</Text>
              <Text style={styles.progressText}>
                {order.is_delivered ? 'Delivered' : 'Arriving Soon'}
              </Text>
            </View>
          </View>

          {/* 4. Action Buttons */}
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={handleNavigation}
          >
            <Text style={styles.primaryButtonText}>View on Map</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF' },
  imageContainer: { height: 300, width: '100%', position: 'absolute', top: 0 },
  heroImage: { height: '100%', width: '100%' },
  imageOverlay: {
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  scrollView: {
    marginTop: 170,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  contentCard: {
    backgroundColor: '#FFF',
    minHeight: 600,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 25,
  },
  orderIdLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 0.5,
  },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20 },
  statusText: { fontSize: 12, fontWeight: '700' },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1C1C1E',
    marginBottom: 20,
    fontFamily: 'System',
  },
  infoRow: { flexDirection: 'row', alignItems: 'center' },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
  },
  textGroup: { marginLeft: 15 },
  label: {
    fontSize: 12,
    color: '#8E8E93',
    marginBottom: 2,
    fontFamily: 'System',
  },
  value: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2C2C2E',
    fontFamily: 'System',
  },
  verticalLine: {
    height: 30,
    width: 2,
    backgroundColor: '#F2F2F7',
    marginLeft: 20,
    marginVertical: 5,
  },
  timelineContainer: { marginTop: 30, marginBottom: 30 },
  progressTrack: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // paddingHorizontal: 40,
  },
  dot: { width: 12, height: 12, borderRadius: 6 },
  line: { flex: 1, height: 3, marginHorizontal: -2 },
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
    paddingHorizontal: 20,
  },
  progressText: { fontSize: 12, color: '#8E8E93', fontWeight: '500' },
  primaryButton: {
    backgroundColor: '#007AFF',
    padding: 18,
    borderRadius: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    backgroundColor: 'transparent',
  },
  secondaryButton: {
    padding: 18,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  secondaryButtonText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '600',
    backgroundColor: 'transparent',
  },
});

export default OrderDetailScreen;
