import AntDesign from '@react-native-vector-icons/ant-design';
import React, { useState } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, Alert } from 'react-native';
import { WebView } from 'react-native-webview';

const EsewaPayment = ({ route, navigation }: any) => {
  const [showWebView, setShowWebView] = useState(false);

  // Example eSewa Parameters
  const paymentDetails = {
    amt: 100, // Total amount
    psc: 0, // Service charge
    pdc: 0, // Delivery charge
    txAmt: 0, // Tax amount
    tAmt: 100, // Total including charges
    pid: 'ORDER_12345', // Unique Order ID
    scd: 'EPAYTEST', // Merchant Code (Use EPAYTEST for sandbox)
    su: 'https://yourwebsite.com/success', // Success URL
    fu: 'https://yourwebsite.com/failure', // Failure URL
  };

  // The HTML form that auto-submits to eSewa
  const esewaFormHtml = `
    <html>
      <body onload="document.forms[0].submit()">
        <form action="https://uat.esewa.com.np/epay/main" method="POST">
          <input value="${paymentDetails.tAmt}" name="tAmt" type="hidden">
          <input value="${paymentDetails.amt}" name="amt" type="hidden">
          <input value="${paymentDetails.txAmt}" name="txAmt" type="hidden">
          <input value="${paymentDetails.psc}" name="psc" type="hidden">
          <input value="${paymentDetails.pdc}" name="pdc" type="hidden">
          <input value="${paymentDetails.scd}" name="scd" type="hidden">
          <input value="${paymentDetails.pid}" name="pid" type="hidden">
          <input value="${paymentDetails.su}" name="su" type="hidden">
          <input value="${paymentDetails.fu}" name="fu" type="hidden">
        </form>
      </body>
    </html>
  `;

  if (showWebView) {
    return (
      <View style={styles.container}>
        <WebView
          source={{ html: esewaFormHtml }}
          onNavigationStateChange={navState => {
            if (navState.url.includes(paymentDetails.su)) {
              Alert.alert('Payment Successful!');
              setShowWebView(false);
              navigation.navigate('OrderHub'); // Navigate back after success
            } else if (navState.url.includes(paymentDetails.fu)) {
              Alert.alert('Payment Failed!');
              // setShowWebView(false);
            }
          }}
        />
      </View>
    );
  }

  return (
    <View style={styles.center}>
      <TouchableOpacity
        style={styles.esewaButton}
        onPress={() => setShowWebView(true)}
      >
        <Text style={styles.buttonText}>Pay with eSewa</Text>
        <AntDesign name="arrow-right" color="#FFF" size={18} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  esewaButton: {
    backgroundColor: '#60BB46', // eSewa Green
    flexDirection: 'row',
    padding: 18,
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 10,
  },
});

export default EsewaPayment;
