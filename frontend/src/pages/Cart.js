import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Cart() {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();
  const [updatingId, setUpdatingId] = useState(null);
  const [removingId, setRemovingId] = useState(null);

  const update = async (productId, quantity) => {
    try {
      setUpdatingId(productId);
      await API.patch('/cart/update', { productId, quantity });
      await fetchCart();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Update failed');
    } finally {
      setUpdatingId(null);
    }
  };

  const remove = async (productId, name) => {
    try {
      setRemovingId(productId);
      await API.delete(`/cart/remove/${productId}`);
      await fetchCart();
      toast.success(`${name} removed from cart`);
    } catch (err) {
      toast.error('Failed to remove item');
    } finally {
      setRemovingId(null);
    }
  };

  if (cart.items.length === 0) return (
    <div style={styles.empty}>
      <ShoppingBag size={90} color="#e0e0e0" />
      <h2 style={styles.emptyTitle}>Your cart is empty</h2>
      <p style={styles.emptyText}>
        Looks like you haven't added anything yet
      </p>
      <Link to="/products" style={styles.shopBtn}>
        🛍️ Start Shopping
      </Link>
    </div>
  );

  return (
    <div style={styles.page}>
      <h1 style={styles.title}>🛒 Your Cart</h1>
      <div style={styles.layout}>

        {/* Cart Items */}
        <div style={styles.items}>
          {cart.items.map(item => (
            <div key={item.productId} style={styles.row}>
              <img
                src={item.image}
                alt={item.name}
                style={styles.img}
                onError={e => e.target.style.display = 'none'}
              />
              <div style={styles.info}>
                <h4 style={styles.name}>{item.name}</h4>
                <p style={styles.unitPrice}>
                  ₹{item.price.toLocaleString()} each
                </p>
              </div>

              {/* Quantity Controls */}
              <div style={styles.qty}>
                <button
                  style={styles.qtyBtn}
                  onClick={() => update(item.productId, item.quantity - 1)}
                  disabled={updatingId === item.productId}>
                  <Minus size={14} />
                </button>
                <span style={styles.qtyNum}>{item.quantity}</span>
                <button
                  style={{
                    ...styles.qtyBtn,
                    opacity: item.quantity >= item.stock ? 0.4 : 1,
                    cursor: item.quantity >= item.stock ? 'not-allowed' : 'pointer',
                  }}
                  onClick={() => update(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock || updatingId === item.productId}>
                  <Plus size={14} />
                </button>
              </div>

              {/* Line Total */}
              <span style={styles.lineTotal}>
                ₹{(item.price * item.quantity).toLocaleString()}
              </span>

              {/* Remove Button */}
              <button
                style={styles.removeBtn}
                onClick={() => remove(item.productId, item.name)}
                disabled={removingId === item.productId}>
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div style={styles.summary}>
          <h3 style={styles.summaryTitle}>Order Summary</h3>

          <div style={styles.summaryRow}>
            <span style={{ color: '#888' }}>
              Items ({cart.items.reduce((s, i) => s + i.quantity, 0)})
            </span>
            <span>₹{cart.total.toLocaleString()}</span>
          </div>

          <div style={styles.summaryRow}>
            <span style={{ color: '#888' }}>Delivery</span>
            <span style={{ color: '#27ae60' }}>FREE</span>
          </div>

          <div style={styles.divider} />

          <div style={{ ...styles.summaryRow, fontWeight: 700, fontSize: 18 }}>
            <span>Total</span>
            <span style={{ color: '#6c63ff' }}>
              ₹{cart.total.toLocaleString()}
            </span>
          </div>

          <button
            style={styles.checkoutBtn}
            onClick={() => navigate('/order-summary')}>
            Proceed to Checkout →
          </button>

          <Link to="/products" style={styles.continueBtn}>
            ← Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1000, margin: '0 auto', padding: '32px 20px' },
  title: { marginBottom: 24, fontSize: 26, fontWeight: 700, color: '#222' },
  layout: { display: 'grid', gridTemplateColumns: '1fr 300px', gap: 24, alignItems: 'start' },
  items: { display: 'flex', flexDirection: 'column', gap: 16 },
  row: { background: '#fff', borderRadius: 14, padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 16, boxShadow: '0 2px 12px rgba(0,0,0,0.06)' },
  img: { width: 70, height: 70, objectFit: 'cover', borderRadius: 10, background: '#f5f5f5' },
  info: { flex: 1 },
  name: { margin: '0 0 4px', fontSize: 15, fontWeight: 600, color: '#222' },
  unitPrice: { margin: 0, fontSize: 13, color: '#888' },
  qty: { display: 'flex', alignItems: 'center', gap: 10 },
  qtyBtn: { background: '#f0f0f0', border: 'none', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' },
  qtyNum: { fontSize: 16, fontWeight: 600, minWidth: 28, textAlign: 'center' },
  lineTotal: { fontWeight: 700, minWidth: 90, textAlign: 'right', color: '#222' },
  removeBtn: { background: 'none', border: 'none', cursor: 'pointer', color: '#e74c3c', padding: 4 },
  summary: { background: '#fff', borderRadius: 16, padding: 24, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', position: 'sticky', top: 80 },
  summaryTitle: { margin: '0 0 20px', fontSize: 18, fontWeight: 700, color: '#222' },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: 15 },
  divider: { height: 1, background: '#f0f0f0', margin: '16px 0' },
  checkoutBtn: { width: '100%', background: '#6c63ff', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontWeight: 600, fontSize: 15, cursor: 'pointer', marginTop: 16 },
  continueBtn: { display: 'block', textAlign: 'center', marginTop: 12, color: '#888', fontSize: 13, textDecoration: 'none' },
  empty: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '70vh', gap: 16, textAlign: 'center' },
  emptyTitle: { color: '#bbb', fontSize: 22, fontWeight: 700 },
  emptyText: { color: '#ccc', fontSize: 15 },
  shopBtn: { marginTop: 8, background: '#6c63ff', color: '#fff', padding: '12px 32px', borderRadius: 10, textDecoration: 'none', fontWeight: 600, fontSize: 15 },
};