export type CardType = 'visa' | 'mastercard' | 'other';

export interface CartItem {
  id: string;
  title: string;
  price: number;
  imageUrl: string;
  selectedColor: string;
  selectedSize: string;
  quantity: number;
  availableColors: string[];
  availableSizes: string[];
}

export interface PaymentCard {
  cardType: CardType;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
}

export interface CartContextType {
  items: CartItem[];
  paymentCard: PaymentCard;
  subtotal: number;
  tax: number;
  shippingCost: number;
  total: number;
  removeItem: (id: string) => void;
  updateColor: (id: string, color: string) => void;
  updateSize: (id: string, size: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  updateCardType: (type: CardType) => void;
  updatePaymentDetails: (details: Partial<PaymentCard>) => void;
  clearCart: () => void;
}