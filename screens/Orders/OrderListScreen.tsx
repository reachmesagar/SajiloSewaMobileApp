import {
  FlatList,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MOCK_ORDERS } from '../../MockDatas/MyOrders';
import { OrderCard } from '../../components/OrderCard';
import FloatingAddButton from '../../components/FAB';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useState } from 'react';
import { database } from '../../models';
import Order from '../../models/Order';
import NetInfo from '@react-native-community/netinfo';
import { logger } from '@nozbe/watermelondb/utils/common';

interface OrderListScreenProps {
  // Add your props here
}

export const OrderListScreen: React.FC<OrderListScreenProps> = ({}) => {
  const navigator = useNavigation<any>();
  const [refreshing, setRefreshing] = useState(false);
  const [data, setData] = useState<Order[]>([]);

  // Handle Press
  const handlePress = () => {
    navigator.navigate('AddRequestScreen');
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    setRefreshing(false);
  };

  // getData
  const getData = async () => {
    database
      .get<Order>('orders')
      .query()
      .fetch()
      .then(orders => {
        console.log(
          'Fetched Orders from DB:',
          // JSON.parse(JSON.stringify(orders)),
        );
        // Map to the raw data to get rid of the WatermelonDB wrappers
        const cleanData: any = orders.map(order => order._raw);

        console.log('Clean Orders:', cleanData);
        setData(cleanData);
      })
      .catch(error => {
        console.error('Error fetching orders:', error);
      });
  };

  // This is used for database update when internet is back
  useEffect(() => {
    getData();
    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        console.log('Internet is back! Triggering sync...');
      }
    });

    return () => unsubscribe();
  }, [database]);

  return (
    // Your JSX content
    <>
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />

        <FlatList
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          data={[...data, ...MOCK_ORDERS]} // Combine mock data with real data from DB
          keyExtractor={(item: any) => item.order_id}
          renderItem={({ item }) => <OrderCard item={item} />}
          contentContainerStyle={styles.listPadding}
        />
        <FloatingAddButton onPress={handlePress}></FloatingAddButton>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    // marginBottom: 20,
    color: '#1d6809',
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
