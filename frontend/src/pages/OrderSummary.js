import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function OrderSummary() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);
  const [loading, setLoading] = useState(false);

  const placeOrder = async () => {
    try {
      setLoading(true);
      await API.post('/cart/place-order');
      await fetchCart();
      setPlaced(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (placed) return (
    <div style={styles.center}>
      <CheckCircle size={90} color="#27ae60" />
      <h2 style={styles.successTitle}>Order Placed Successfully!</h2>
      <p style={styles.successText}>
        Thank you for shopping with TechCart 🎉
      </p>
      <button
        style={styles.continueBtn}
        onClick={() => navigate('/products')}>
        Continue Shopping
      </button>
    </div>
  );

  if (cart.items.length === 0) return (
    <div style={styles.center}>
      <Package size={80} color="#ddd" />
      <h2 style={{ color: '#bbb' }}>No items to checkout</h2>
      <button
        style={styles.continueBtn}
        onClick={() => navigate('/products')}>
        Go Shopping
      </button>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📦 Order Summary</h1>
      <div style={styles.card}>

        {/* Items List */}
        {cart.items.map(item => (
          <div key={item.productId} style={styles.row}>
            <img
              src={item.image}
              alt={item.name}
              style={styles.img}
              onError={e => e.target.style.display = 'none'}
            />
            <span style={styles.itemName}>{item.name}</span>
            <span style={styles.qty}>× {item.quantity}</span>
            <span style={styles.price}>
              ₹{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}

        <div style={styles.divider} />

        {/* Total */}
        <div style={styles.totalRow}>
          <span style={{ fontWeight: 600, fontSize: 16 }}>Total Amount</span>
          <span style={styles.totalAmount}>
            ₹{cart.total.toLocaleString()}
          </span>
        </div>

        {/* Buttons */}
        <button
          style={styles.placeBtn}
          onClick={placeOrder}
          disabled={loading}>
          {loading ? 'Placing Order...' : '✅ Place Order'}
        </button>

        <button
          style={styles.backBtn}
          onClick={() => navigate('/cart')}>
          ← Back to Cart
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 580, margin: '40px auto', padding: '0 20px' },
  title: { marginBottom: 24, fontSize: 26, fontWeight: 700, color: '#222' },
  card: { background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  row: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
  img: { width: 52, height: 52, objectFit: 'cover', borderRadius: 8, background: '#f5f5f5' },
  itemName: { flex: 1, fontSize: 15, fontWeight: 500, color: '#222' },
  qty: { color: '#888', fontSize: 14 },
  price: { fontWeight: 600, minWidth: 90, textAlign: 'right', color: '#222' },
  divider: { height: 1, background: '#f0f0f0', margin: '16px 0' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  totalAmount: { fontSize: 22, fontWeight: 700, color: '#6c63ff' },
  placeBtn: { width: '100%', background: '#6c63ff', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginBottom: 10 },
  backBtn: { width: '100%', background: '#f5f5f5', color: '#555', border: 'none', padding: '12px', borderRadius: 10, fontWeight: 500, fontSize: 14, cursor: 'pointer' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 16, textAlign: 'center', padding: 20 },
  successTitle: { color: '#27ae60', fontSize: 24, fontWeight: 700 },
  successText: { color: '#888', fontSize: 15 },
  continueBtn: { background: '#6c63ff', color: '#fff', border: 'none', padding: '12px 32px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 8 },
};