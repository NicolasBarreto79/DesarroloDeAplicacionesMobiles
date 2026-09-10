import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CartItem, PaymentCard, CardType, CartContextType } from '../types';

const initialItems: CartItem[] = [
  {
    id: '1',
    title: 'Remera Algodón Premium',
    price: 29.99,
    imageUrl: 'https://via.placeholder.com/150',
    selectedColor: 'Negro',
    selectedSize: 'M',
    quantity: 1,
    availableColors: ['Negro', 'Blanco', 'Azul', 'Rojo'],
    availableSizes: ['S', 'M', 'L', 'XL'],
  },
  {
    id: '2',
    title: 'Zapatillas Urbanas',
    price: 89.99,
    imageUrl: 'https://via.placeholder.com/150',
    selectedColor: 'Blanco',
    selectedSize: '42',
    quantity: 1,
    availableColors: ['Blanco', 'Negro', 'Gris'],
    availableSizes: ['39', '40', '41', '42', '43'],
  },
  {
    id: '3',
    title: 'Campera Oversize',
    price: 119.50,
    imageUrl: 'https://via.placeholder.com/150',
    selectedColor: 'Azul',
    selectedSize: 'L',
    quantity: 1,
    availableColors: ['Azul', 'Verde', 'Negro'],
    availableSizes: ['M', 'L', 'XL'],
  },
];

const initialCard: PaymentCard = {
  cardType: 'visa',
  cardNumber: '',
  cardHolder: '',
  expiryDate: '',
  cvv: '',
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [paymentCard, setPaymentCard] = useState<PaymentCard>(initialCard);

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.21;
  const shippingCost = items.length === 0 ? 0 : 15.0;
  const total = subtotal + tax + shippingCost;

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  };

  const updateColor = (id: string, color: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selectedColor: color } : item))
    );
  };

  const updateSize = (id: string, size: string) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, selectedSize: size } : item))
    );
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const updateCardType = (cardType: CardType) => {
    setPaymentCard((prev) => ({ ...prev, cardType }));
  };

  const updatePaymentDetails = (details: Partial<PaymentCard>) => {
    setPaymentCard((prev) => ({ ...prev, ...details }));
  };

  const clearCart = () => {
    setItems([]);
  };

  return (
    <CartContext.Provider
      value={{
        items,
        paymentCard,
        subtotal,
        tax,
        shippingCost,
        total,
        removeItem,
        updateColor,
        updateSize,
        updateQuantity,
        updateCardType,
        updatePaymentDetails,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};