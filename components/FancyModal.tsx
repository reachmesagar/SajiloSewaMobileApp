import AntDesign from '@react-native-vector-icons/ant-design';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import {
  Alert,
  Dimensions,
  Modal,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';

const { height } = Dimensions.get('window');

interface DeliveryModalProps {
  isVisible: boolean;
  onClose: (data: any) => void;
}

const DeliveryDetailsModal = ({ isVisible, onClose }: DeliveryModalProps) => {
  const navigator = useNavigation<any>();
  const [senderLocationDetails, setSenderLocationDetails] = React.useState<{
    location: {
      lat: number;
      lng: number;
      address: string;
    } | null;
  }>({ location: null });
  const [recipientLocationDetails, setRecipientLocationDetails] =
    React.useState<{
      location: { lat: number; lng: number; address: string } | null;
    }>({ location: null });

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <View style={styles.centeredView}>
        <View style={styles.modalView}>
          {/* Handle bar for dragging feel */}
          <View style={styles.dragHandle} />

          <View style={styles.header}>
            <Text style={styles.modalTitle}>Route Details</Text>
            <AntDesign
              name="close"
              size={18  }
              color="#8E8E93"
              onPress={() => navigator.goBack()}
            />
          </View>

          {/* Timeline View */}
          <View style={styles.routeContainer}>
            {/* Vertical Line */}
            <View style={styles.timelineLine} />

            {/* Current Location Row */}
            <View style={styles.locationRow}>
              <View style={[styles.dot, { backgroundColor: '#34C759' }]} />

              <GooglePlacesAutocomplete
                fetchDetails={true}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry', // Request only the geometry data
                }}
                styles={{
                  listView: {
                    height: height * 0.15,
                    // width: 120,
                  },
                  textInput: {
                    fontSize: 16,
                    backgroundColor: '#11112952',
                  },
                }}
                placeholder="Delivery Address"
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(
                    data,
                    details,
                    details?.geometry?.location.lat,
                    details?.geometry?.location.lng,
                  );

                  setRecipientLocationDetails({
                    location: {
                      lat: details?.geometry?.location.lat || 0,
                      lng: details?.geometry?.location.lng || 0,
                      address: data.description,
                    },
                  });
                }}
                query={{
                  key: 'AIzaSyDBmR1VwADAIy08TV9gdf96Hx7g1FKESuE',
                  language: 'en',
                  country: 'np',
                  components: 'country:np',
                }}
              />
            </View>

            <View style={{ height: 30 }} />

            {/* Delivery Location Row */}
            <View style={styles.locationRow}>
              <View style={[styles.dot, { backgroundColor: '#007AFF' }]} />
              <GooglePlacesAutocomplete
                fetchDetails={true}
                GooglePlacesDetailsQuery={{
                  fields: 'geometry', // Request only the geometry data
                }}
                styles={{
                  listView: {
                    height: height * 0.15,
                    // width: 120,
                  },
                  textInput: {
                    fontSize: 16,
                    backgroundColor: '#11112952',
                  },
                }}
                placeholder="Delivery Address"
                onPress={(data, details = null) => {
                  // 'details' is provided when fetchDetails = true
                  console.log(
                    data,
                    details,
                    details?.geometry?.location.lat,
                    details?.geometry?.location.lng,
                  );

                  setSenderLocationDetails({
                    location: {
                      lat: details?.geometry?.location.lat || 0,
                      lng: details?.geometry?.location.lng || 0,
                      address: data.description,
                    },
                  });
                }}
                query={{
                  key: 'AIzaSyDBmR1VwADAIy08TV9gdf96Hx7g1FKESuE',
                  language: 'en',
                  country: 'np',
                  components: 'country:np',
                }}
              />
            </View>
          </View>

          <TouchableOpacity
            style={styles.confirmButton}
            onPress={() => {
              if (
                !senderLocationDetails.location ||
                !recipientLocationDetails.location
              ) {
                Alert.alert(
                  'Please select both sender and recipient locations.',
                );
                return;
              }

              onClose({
                sender: senderLocationDetails,
                recipient: recipientLocationDetails,
              });
            }}
          >
            <Text style={styles.confirmText}>Confirm Route</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)', // Dim background
  },
  modalView: {
    backgroundColor: 'white',
    borderTopLeftRadius: 32,
    borderTopRightRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 20,
    minHeight: (height * 1) / 2,
  },
  dragHandle: {
    width: 40,
    height: 5,
    backgroundColor: '#E5E5EA',
    borderRadius: 10,
    alignSelf: 'center',
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1C1C1E',
    letterSpacing: -0.5,
  },
  routeContainer: {
    paddingLeft: 10,
    marginBottom: 40,
  },
  timelineLine: {
    position: 'absolute',
    left: 14,
    top: 25,
    bottom: 25,
    width: 2,
    backgroundColor: '#F2F2F7',
    zIndex: -1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginTop: 6,
    marginRight: 20,
    borderWidth: 2,
    borderColor: '#FFF',
    elevation: 3,
  },
  textContainer: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: '#8E8E93',
    marginBottom: 4,
  },
  addressText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#2C2C2E',
    lineHeight: 20,
  },
  confirmButton: {
    backgroundColor: '#007AFF',
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  confirmText: {
    color: 'white',
    fontSize: 17,
    fontWeight: '700',
  },
});

export default DeliveryDetailsModal;
