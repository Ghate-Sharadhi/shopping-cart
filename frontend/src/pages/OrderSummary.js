import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle } from 'lucide-react';
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
      <CheckCircle size={80} color="#27ae60" />
      <h2 style={{ color: '#27ae60' }}>Order Placed Successfully! 🎉</h2>
      <p style={{ color: '#888' }}>Thank you for shopping with TechCart</p>
      <button style={styles.btn} onClick={() => navigate('/products')}>
        Continue Shopping
      </button>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>📦 Order Summary</h1>
      <div style={styles.card}>
        {cart.items.map(item => (
          <div key={item.productId} style={styles.row}>
            <img src={item.image} alt={item.name} style={styles.img}
              onError={e => e.target.style.display = 'none'} />
            <span style={{ flex: 1 }}>{item.name}</span>
            <span style={{ color: '#888' }}>× {item.quantity}</span>
            <span style={styles.price}>
              ₹{(item.price * item.quantity).toLocaleString()}
            </span>
          </div>
        ))}
        <div style={styles.total}>
          <span>Total</span>
          <span style={{ color: '#6c63ff', fontWeight: 700, fontSize: 20 }}>
            ₹{cart.total.toLocaleString()}
          </span>
        </div>
        <button style={styles.btn} onClick={placeOrder} disabled={loading}>
          {loading ? 'Placing Order...' : '✅ Place Order'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 600, margin: '40px auto', padding: '0 20px' },
  title: { marginBottom: 24, fontSize: 26, fontWeight: 700 },
  card: { background: '#fff', borderRadius: 16, padding: 28, boxShadow: '0 4px 20px rgba(0,0,0,0.08)' },
  row: { display: 'flex', alignItems: 'center', gap: 14, padding: '12px 0', borderBottom: '1px solid #f5f5f5' },
  img: { width: 50, height: 50, objectFit: 'cover', borderRadius: 8 },
  price: { fontWeight: 600, minWidth: 80, textAlign: 'right' },
  total: { display: 'flex', justifyContent: 'space-between', padding: '20px 0 8px', fontSize: 17 },
  btn: { width: '100%', background: '#6c63ff', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 16 },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 14, textAlign: 'center' },
};