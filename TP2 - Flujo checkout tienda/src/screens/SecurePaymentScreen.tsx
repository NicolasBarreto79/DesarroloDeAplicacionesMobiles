import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useCart } from '../context/CartContext';
import { CardType } from '../types';

interface Props {
  navigation: any;
}

export const SecurePaymentScreen: React.FC<Props> = ({ navigation }) => {
  const { paymentCard, updateCardType, updatePaymentDetails, total, clearCart } = useCart();

  const [cardHolder, setCardHolder] = useState(paymentCard.cardHolder);
  const [cardNumber, setCardNumber] = useState(paymentCard.cardNumber);
  const [expiryDate, setExpiryDate] = useState(paymentCard.expiryDate);
  const [cvv, setCvv] = useState(paymentCard.cvv);

  const handlePayment = () => {
    if (!cardHolder.trim()) {
      Alert.alert('Error', 'Por favor ingrese el nombre del titular');
      return;
    }
    if (!cardNumber.trim() || cardNumber.replace(/\s/g, '').length < 13) {
      Alert.alert('Error', 'Ingrese un número de tarjeta válido');
      return;
    }
    if (!expiryDate.trim()) {
      Alert.alert('Error', 'Ingrese la fecha de vencimiento');
      return;
    }
    if (!cvv.trim() || cvv.length < 3) {
      Alert.alert('Error', 'Ingrese un CVV válido');
      return;
    }

    updatePaymentDetails({ cardHolder, cardNumber, expiryDate, cvv });

    const cardTypeNames: Record<CardType, string> = {
      visa: 'Visa',
      mastercard: 'MasterCard',
      other: 'Otra Tarjeta',
    };

    Alert.alert(
      '¡Pago Exitoso!',
      `Monto abonado: $${total.toFixed(2)}\nTarjeta: ${cardTypeNames[paymentCard.cardType]}\n\nGracias por tu compra.`,
      [
        {
          text: 'Volver al Inicio',
          onPress: () => {
            clearCart();
            navigation.popToTop();
          },
        },
      ]
    );
  };

  const cardTypes: { type: CardType; label: string; icon: string }[] = [
    { type: 'visa', label: 'Visa', icon: '💳' },
    { type: 'mastercard', label: 'MasterCard', icon: '💳' },
    { type: 'other', label: 'Otra', icon: '💳' },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>Seleccione Tipo de Tarjeta</Text>
        <View style={styles.cardTypeRow}>
          {cardTypes.map(({ type, label, icon }) => {
            const isSelected = paymentCard.cardType === type;
            return (
              <TouchableOpacity
                key={type}
                style={[styles.cardTypeTile, isSelected && styles.cardTypeTileSelected]}
                onPress={() => updateCardType(type)}
              >
                <Text style={styles.cardTypeIcon}>{icon}</Text>
                <Text style={[styles.cardTypeLabel, isSelected && styles.cardTypeLabelSelected]}>
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Detalles de la Tarjeta</Text>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Nombre del Titular</Text>
          <TextInput
            style={styles.input}
            placeholder="Juan Perez"
            value={cardHolder}
            onChangeText={setCardHolder}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.inputLabel}>Número de Tarjeta</Text>
          <TextInput
            style={styles.input}
            placeholder="4532 1234 5678 9012"
            keyboardType="numeric"
            value={cardNumber}
            onChangeText={setCardNumber}
          />
        </View>

        <View style={styles.rowInputs}>
          <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
            <Text style={styles.inputLabel}>Vencimiento (MM/AA)</Text>
            <TextInput
              style={styles.input}
              placeholder="12/28"
              value={expiryDate}
              onChangeText={setExpiryDate}
            />
          </View>
          <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
            <Text style={styles.inputLabel}>CVV / CVC</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              keyboardType="numeric"
              secureTextEntry
              maxLength={4}
              value={cvv}
              onChangeText={setCvv}
            />
          </View>
        </View>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Resumen del Pedido</Text>
          <View style={styles.summaryRow}>
            <Text style={styles.summaryText}>Monto Total a Pagar:</Text>
            <Text style={styles.summaryTotal}>${total.toFixed(2)}</Text>
          </View>
        </View>

        <TouchableOpacity
          style={styles.payButton}
          onPress={handlePayment}
        >
          <Text style={styles.payButtonText}>Pagar ${total.toFixed(2)}</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  scrollContent: { padding: 20 },
  sectionTitle: { fontSize: 16, fontWeight: 'bold', color: '#1C1C1E', marginTop: 12, marginBottom: 12 },
  cardTypeRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  cardTypeTile: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginHorizontal: 4, borderWidth: 1, borderColor: '#E5E5EA' },
  cardTypeTileSelected: { borderColor: '#007AFF', backgroundColor: '#E5F0FF', borderWidth: 2 },
  cardTypeIcon: { fontSize: 24, marginBottom: 4 },
  cardTypeLabel: { fontSize: 13, color: '#8E8E93' },
  cardTypeLabelSelected: { color: '#007AFF', fontWeight: 'bold' },
  inputGroup: { marginBottom: 16 },
  inputLabel: { fontSize: 14, color: '#8E8E93', marginBottom: 6 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 12, fontSize: 16, color: '#1C1C1E' },
  rowInputs: { flexDirection: 'row' },
  summaryCard: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 16, marginVertical: 16, borderWidth: 1, borderColor: '#E5E5EA' },
  summaryTitle: { fontSize: 15, fontWeight: 'bold', color: '#1C1C1E', marginBottom: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  summaryText: { fontSize: 14, color: '#8E8E93' },
  summaryTotal: { fontSize: 18, fontWeight: 'bold', color: '#007AFF' },
  payButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 16, alignItems: 'center', marginTop: 8 },
  payButtonText: { color: '#FFFFFF', fontSize: 18, fontWeight: 'bold' },
});