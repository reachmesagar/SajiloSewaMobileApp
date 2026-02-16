import React from 'react';
import { StyleSheet, TouchableOpacity, View, Platform } from 'react-native';
// You can install this via: npm install lucide-react-native
import AntDesign from '@react-native-vector-icons/ant-design';
import { useNavigation } from '@react-navigation/native';

interface FABProps {
  onPress: () => void;
}

const FloatingAddButton: React.FC<FABProps> = ({ onPress }) => {


  return (
    <TouchableOpacity style={styles.fab} onPress={onPress} activeOpacity={0.8}>
      <AntDesign name="plus" color="#FFFFFF" size={28} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 25,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007AFF', // Modern iOS Blue
    justifyContent: 'center',
    alignItems: 'center',
    // Shadow for iOS
    shadowColor: '#007AFF',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    // Elevation for Android
    elevation: 8,
  },
});

export default FloatingAddButton;
