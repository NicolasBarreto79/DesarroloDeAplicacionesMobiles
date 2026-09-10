import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useCart } from '../context/CartContext';
import { CartItem } from '../types';

interface Props {
  navigation: any;
}

export const ShoppingCartScreen: React.FC<Props> = ({ navigation }) => {
  const {
    items,
    subtotal,
    tax,
    shippingCost,
    total,
    removeItem,
    updateColor,
    updateSize,
    updateQuantity,
  } = useCart();

  const handleRemove = (item: CartItem) => {
    Alert.alert(
      'Eliminar producto',
      `¿Deseas eliminar ${item.title} del carrito?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        { text: 'Eliminar', style: 'destructive', onPress: () => removeItem(item.id) },
      ]
    );
  };

  const renderCartItem = ({ item }: { item: CartItem }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.imageText}>📦</Text>
      </View>
      <View style={styles.itemInfo}>
        <View style={styles.headerRow}>
          <Text style={styles.itemTitle} numberOfLines={1}>
            {item.title}
          </Text>
          <TouchableOpacity onPress={() => handleRemove(item)} style={styles.deleteButton}>
            <Text style={styles.deleteText}>🗑️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.itemPrice}>${item.price.toFixed(2)}</Text>

        <View style={styles.selectorsRow}>
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Color:</Text>
            <Picker
              selectedValue={item.selectedColor}
              style={styles.picker}
              onValueChange={(value) => updateColor(item.id, value)}
            >
              {item.availableColors.map((color) => (
                <Picker.Item key={color} label={color} value={color} />
              ))}
            </Picker>
          </View>

          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Size:</Text>
            <Picker
              selectedValue={item.selectedSize}
              style={styles.picker}
              onValueChange={(value) => updateSize(item.id, value)}
            >
              {item.availableSizes.map((size) => (
                <Picker.Item key={size} label={size} value={size} />
              ))}
            </Picker>
          </View>

          <View style={styles.qtyContainer}>
            <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, item.quantity - 1)}>
              <Text style={styles.qtyButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.qtyText}>{item.quantity}</Text>
            <TouchableOpacity style={styles.qtyButton} onPress={() => updateQuantity(item.id, item.quantity + 1)}>
              <Text style={styles.qtyButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🛒</Text>
        <Text style={styles.emptyTitle}>El carrito está vacío</Text>
        <Text style={styles.emptySubtitle}>Agrega productos para continuar con la compra</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={renderCartItem}
        contentContainerStyle={styles.listContent}
      />

      <View style={styles.summaryContainer}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal:</Text>
          <Text style={styles.summaryValue}>${subtotal.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Impuestos (21%):</Text>
          <Text style={styles.summaryValue}>${tax.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Envío:</Text>
          <Text style={styles.summaryValue}>${shippingCost.toFixed(2)}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
        </View>

        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => navigation.navigate('SecurePayment')}
        >
          <Text style={styles.checkoutButtonText}>Proceder al Pago</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F5F5F7' },
  listContent: { padding: 16 },
  card: { backgroundColor: '#FFFFFF', borderRadius: 12, padding: 12, marginBottom: 12, flexDirection: 'row', elevation: 3 },
  imagePlaceholder: { width: 70, height: 70, backgroundColor: '#EAEAEA', borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  imageText: { fontSize: 32 },
  itemInfo: { flex: 1, marginLeft: 12 },
  headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  itemTitle: { fontSize: 16, fontWeight: 'bold', flex: 1, color: '#1C1C1E' },
  deleteButton: { padding: 4 },
  deleteText: { fontSize: 18 },
  itemPrice: { fontSize: 15, fontWeight: '600', color: '#007AFF', marginTop: 2 },
  selectorsRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 8, flexWrap: 'wrap' },
  pickerContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 6, paddingHorizontal: 4, marginRight: 4, marginBottom: 4 },
  pickerLabel: { fontSize: 12, color: '#8E8E93' },
  picker: { width: 90, height: 35 },
  qtyContainer: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5EA', borderRadius: 6, paddingHorizontal: 6, height: 35 },
  qtyButton: { paddingHorizontal: 6 },
  qtyButtonText: { fontSize: 16, fontWeight: 'bold', color: '#007AFF' },
  qtyText: { fontSize: 14, fontWeight: 'bold', marginHorizontal: 6 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F5F5F7' },
  emptyIcon: { fontSize: 64, marginBottom: 16 },
  emptyTitle: { fontSize: 20, fontWeight: 'bold', color: '#1C1C1E' },
  emptySubtitle: { fontSize: 14, color: '#8E8E93', marginTop: 6 },
  summaryContainer: { backgroundColor: '#FFFFFF', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, elevation: 8 },
  summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 6 },
  summaryLabel: { fontSize: 14, color: '#8E8E93' },
  summaryValue: { fontSize: 14, color: '#1C1C1E' },
  divider: { height: 1, backgroundColor: '#E5E5EA', marginVertical: 10 },
  totalLabel: { fontSize: 18, fontWeight: 'bold', color: '#1C1C1E' },
  totalValue: { fontSize: 20, fontWeight: 'bold', color: '#007AFF' },
  checkoutButton: { backgroundColor: '#007AFF', borderRadius: 12, paddingVertical: 14, alignItems: 'center', marginTop: 16 },
  checkoutButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: 'bold' },
});