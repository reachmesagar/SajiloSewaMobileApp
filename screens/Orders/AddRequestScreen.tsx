import { Formik } from 'formik';
import React, { useEffect, useRef, useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import * as Yup from 'yup';
// --- Ant Design Vector Icons Import ---
import NetInfo from '@react-native-community/netinfo';
import AntDesign from '@react-native-vector-icons/ant-design';
import BackgroundGeolocation from 'react-native-background-geolocation';
import { SafeAreaView } from 'react-native-safe-area-context';
import { database } from '../../models';
import Order from '../../models/Order';
import DeliveryDetailsModal from '../../components/FancyModal';

const RequestSchema = Yup.object().shape({
  recipientName: Yup.string().min(2, 'Too Short!').required('Required'),
  senderName: Yup.string().min(2, 'Too Short!').required('Required'),
  contactInfo: Yup.string().min(10).required('Required'),
  paymentMethod: Yup.string().required('Required'),
});

const CreateRequestScreen = () => {
  const [isOffline, setIsOffline] = useState(false);
  const formikRef = useRef<any>(null);
  const [isModalVisible, setIsModalVisible] = useState(true);

  // Handling SUbmit
  const handleSubmit = async (orderData: any) => {
    console.log('Submiting data', orderData, isOffline);
    try {
      await database.write(async () => {
        await database.get<Order>('orders').create(order => {
          order.orderId = `ORD-${Math.floor(Math.random() * 9000) + 1000}-X`;
          order.senderName = orderData.senderName;
          order.recipientName = orderData.recipientName;
          order.isDelivered = false;
          order.senderLocation = orderData.senderLocation;
          order.receiptLocation = orderData.receiptLocation;
          order.isCOD = orderData.paymentMethod === 'COD' ? true : false;

          // Map the object to columns
          order.senderLat = orderData.senderLat;
          order.senderLng = orderData.senderLng;
          order.receiptLat = orderData.receiptLat;
          order.receiptLng = orderData.receiptLng;
          order.isSynced = !isOffline;
        });
      });
    } catch (e) {
      console.error('Error saving order:', e);
    } finally {
      setIsModalVisible(false);
    }
  };

  // This code automatically prevents switching from online to offline
  useEffect(() => {
    const onLocation = BackgroundGeolocation.onLocation(
      location => {
        console.log(
          '[Location Received]',
          location.coords.latitude,
          location.coords.longitude,
        );
      },
      error => {
        console.warn('[Location Error]', error);
      },
    );

    const unsubscribe = NetInfo.addEventListener(state => {
      if (state.isConnected && state.isInternetReachable) {
        setIsOffline(false);
      } else {
        setIsOffline(true);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <DeliveryDetailsModal
        isVisible={isModalVisible}
        onClose={result => {
          console.log('Modal Result:', result);
          if (result?.recipient && result?.sender) {
            formikRef.current.setFieldValue(
              'receiptLocation',
              result.recipient.location.address,
            );
            formikRef.current.setFieldValue(
              'senderLocation',
              result.sender.location.address,
            );

            formikRef.current.setFieldValue(
              'receiptLat',
              result.recipient.location.lat,
            );
            formikRef.current.setFieldValue(
              'receiptLng',
              result.recipient.location.lng,
            );
            formikRef.current.setFieldValue(
              'senderLat',
              result.sender.location.lat,
            );
            formikRef.current.setFieldValue(
              'senderLng',
              result.sender.location.lng,
            );
            setIsModalVisible(!isModalVisible);
          }
        }}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>
                {formikRef.current?.values?.address || 'New Shipment'}
              </Text>
              <Text style={styles.subtitle}>Enter delivery details below</Text>
            </View>
            <TouchableOpacity
              onPress={() => setIsOffline(!isOffline)}
              style={[styles.networkBadge, isOffline && styles.offlineBadge]}
            >
              <AntDesign
                name={isOffline ? 'disconnect' : 'safety'}
                size={16}
                color={isOffline ? '#FF3B30' : '#34C759'}
              />
              <Text
                style={[styles.networkText, isOffline && { color: '#FF3B30' }]}
              >
                {isOffline ? 'Offline' : 'Online'}
              </Text>
            </TouchableOpacity>
          </View>

          <Formik
            innerRef={formikRef}
            initialValues={{
              recipientName: '',
              senderLocation: '',
              contactInfo: '',
              paymentMethod: 'COD',
              senderName: '',
              receiptLocation: '',
              receiptLat: 0,
              receiptLng: 0,
              senderLat: 0,
              senderLng: 0,
            }}
            validationSchema={RequestSchema}
            onSubmit={values => {
              console.log('Submitting values:', values);
              handleSubmit(values);
            }}
          >
            {({
              handleChange,
              handleBlur,
              handleSubmit,
              values,
              errors,
              touched,
              setFieldValue,
            }) => (
              <View style={styles.formCard}>
                {/* Recipient Input */}
                <InputField
                  label="Sender NAME"
                  icon={<AntDesign name="user" size={20} color="#8E8E93" />}
                  placeholder="Sita Thapa"
                  onChangeText={handleChange('senderName')}
                  onBlur={handleBlur('senderName')}
                  value={values.senderName}
                  error={touched.recipientName && errors.recipientName}
                />
                <InputField
                  label="RECIPIENT NAME"
                  icon={<AntDesign name="user" size={20} color="#8E8E93" />}
                  placeholder="Ram Dhakal"
                  onChangeText={handleChange('recipientName')}
                  onBlur={handleBlur('recipientName')}
                  value={values.recipientName}
                  error={touched.recipientName && errors.recipientName}
                />

                {/* Contact Input */}
                <InputField
                  label="CONTACT INFO"
                  icon={<AntDesign name="contacts" size={20} color="#8E8E93" />}
                  placeholder="0912345678"
                  keyboardType="phone-pad"
                  onChangeText={handleChange('contactInfo')}
                  onBlur={handleBlur('contactInfo')}
                  value={values.contactInfo}
                  error={touched.contactInfo && errors.contactInfo}
                />

                <Text style={styles.sectionLabel}>PAYMENT METHOD</Text>

                {/* COD Option */}
                <PaymentTab
                  active={values.paymentMethod === 'COD'}
                  onPress={() => setFieldValue('paymentMethod', 'COD')}
                  icon="wallet"
                  label="Cash on Delivery"
                />

                {/* Online Payment (Offline-first Logic) */}
                <PaymentTab
                  active={values.paymentMethod === 'Online'}
                  disabled={isOffline}
                  onPress={() => setFieldValue('paymentMethod', 'Online')}
                  icon="mobile"
                  label={`Online Payment ${isOffline ? '(Disabled)' : ''}`}
                />

                {/* <EsewaPayment></EsewaPayment> */}
                <TouchableOpacity
                  style={[
                    styles.submitButton,
                    isOffline && styles.offlineButton,
                  ]}
                  onPress={handleSubmit}
                >
                  <Text style={styles.submitText}>
                    {isOffline ? 'Save Locally' : 'Confirm Shipment'}
                  </Text>
                  <AntDesign name="arrow-right" color="#FFF" size={18} />
                </TouchableOpacity>
              </View>
            )}
          </Formik>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const InputField = ({ label, icon, error, ...props }: any) => (
  <View style={styles.inputWrapper}>
    <Text style={styles.label}>{label}</Text>
    <View style={[styles.inputContainer, error && styles.inputError]}>
      {icon}
      <TextInput
        style={styles.input}
        placeholderTextColor="#C7C7CC"
        {...props}
      />
    </View>
    {error && <Text style={styles.errorText}>{error}</Text>}
  </View>
);

const PaymentTab = ({ active, disabled, onPress, icon, label }: any) => (
  <TouchableOpacity
    disabled={disabled}
    style={[
      styles.paymentOption,
      active && styles.paymentActive,
      disabled && styles.paymentDisabled,
    ]}
    onPress={onPress}
  >
    <AntDesign
      name={icon}
      size={20}
      color={disabled ? '#C7C7CC' : active ? '#007AFF' : '#8E8E93'}
    />
    <Text style={[styles.paymentText, disabled && { color: '#C7C7CC' }]}>
      {label}
    </Text>
    {active && !disabled && (
      <AntDesign name="check-circle" size={18} color="#007AFF" />
    )}
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8F9FB' },
  scrollContent: { padding: 5 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 25,
  },
  title: { fontSize: 18, fontWeight: '800', color: '#1010b7' },
  subtitle: { fontSize: 13, color: '#8E8E93', marginTop: 2, fontWeight: '500' },
  networkBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E1F8ED',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  offlineBadge: { backgroundColor: '#FFE5E5' },
  networkText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#34C759',
    marginLeft: 5,
  },
  formCard: {
    backgroundColor: '#FFF',
    borderRadius: 24,
    padding: 22,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 20,
    elevation: 4,
  },
  inputWrapper: { marginBottom: 18 },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#AEAEB2',
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 14,
    paddingHorizontal: 15,
  },
  inputError: {
    borderWidth: 1,
    borderColor: '#FF3B30',
    backgroundColor: '#FFF5F5',
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 12,
    fontSize: 15,
    color: '#1C1C1E',
    fontWeight: '500',
  },
  errorText: { color: '#FF3B30', fontSize: 11, marginTop: 4, marginLeft: 5 },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: '#AEAEB2',
    marginTop: 15,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#F2F2F7',
    marginBottom: 10,
  },
  paymentActive: { borderColor: '#007AFF', backgroundColor: '#F0F7FF' },
  paymentDisabled: { opacity: 0.4 },
  paymentText: {
    fontSize: 15,
    fontWeight: '600',
    flex: 1,
    marginLeft: 12,
    color: '#2C2C2E',
  },
  submitButton: {
    backgroundColor: '#007AFF',
    borderRadius: 18,
    padding: 18,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 25,
  },
  offlineButton: { backgroundColor: '#1C1C1E' }, // Change color to indicate local save
  submitText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '700',
    marginRight: 10,
  },
});

export default CreateRequestScreen;
