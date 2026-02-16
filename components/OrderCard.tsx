import { useNavigation } from '@react-navigation/native';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface OrderCardProps {
  // Add your props here
  item: {
    order_id: string;
    sender_name: string;
    recipient_name: string;
    is_delivered: boolean;
    is_synced?: boolean;
  };
}

export const OrderCard: React.FC<OrderCardProps> = ({ item }) => {
  const navigator = useNavigation<any>();

  const hadleNavigation = () => {
    // Implement navigation to OrderDetailScreen here
    navigator.navigate('OrderDetailScreen');
  };

  return (
    // Your JSX content
    <TouchableOpacity onPress={hadleNavigation} style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>{item.order_id}</Text>
        <View
          style={[
            styles.badge,
            { backgroundColor: item.is_delivered ? '#E1F8ED' : '#FFF4E5' },
          ]}
        >
          <Text
            style={[
              styles.badgeText,
              {
                color: item.is_delivered
                  ? '#2D9CDB'
                  : item.is_synced
                  ? '#FFA000'
                  : '#FFA000',
              },
            ]}
          >
            {item.is_delivered ? '● Delivered' : '○ In Transit'}
          </Text>
        </View>
        <Text>
          {item.is_synced && item.is_synced === true ? 'Synced' : 'Syncing'}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.row}>
        <View>
          <Text style={styles.label}>SENDER</Text>
          <Text style={styles.name}>{item.sender_name}</Text>
        </View>
        <View style={styles.arrowContainer}>
          <Text style={styles.arrow}>→</Text>
        </View>
        <View style={{ alignItems: 'flex-end' }}>
          <Text style={styles.label}>RECIPIENT</Text>
          <Text style={styles.name}>{item.recipient_name}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    margin: 20,
    color: '#1A1A1A',
  },
  listPadding: { paddingHorizontal: 16, paddingBottom: 20 },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    // Fancy Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 12,
    // Shadow for Android
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  orderId: {
    fontSize: 13,
    fontWeight: '700',
    color: '#8E8E93',
    letterSpacing: 1,
  },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  badgeText: { fontSize: 12, fontWeight: '600' },
  divider: { height: 1, backgroundColor: '#F1F1F1', marginVertical: 15 },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  label: { fontSize: 10, color: '#AEAEB2', fontWeight: '600', marginBottom: 4 },
  name: { fontSize: 15, fontWeight: '600', color: '#2C2C2E' },
  arrowContainer: { opacity: 0.3 },
  arrow: { fontSize: 20 },
});
