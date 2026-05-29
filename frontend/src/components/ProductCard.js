import React, { useState } from 'react';
import { ShoppingCart } from 'lucide-react';
import API from '../api/axios';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function ProductCard({ product }) {
  const { fetchCart } = useCart();
  const [loading, setLoading] = useState(false);

  const handleAdd = async () => {
    try {
      setLoading(true);
      const res = await API.post('/cart/add', {
        productId: product._id,
        quantity: 1,
      });
      await fetchCart();
      toast.success(res.data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setLoading(false);
    }
  };

  const outOfStock = product.stock === 0;

  return (
    <div style={styles.card}>
      <div style={styles.imgWrap}>
        {product.image ? (
          <img src={product.image} alt={product.name} style={styles.img} />
        ) : (
          <div style={styles.placeholder}>No Image</div>
        )}
        {outOfStock && <div style={styles.outBadge}>Out of Stock</div>}
      </div>
      <div style={styles.body}>
        <h3 style={styles.name}>{product.name}</h3>
        <p style={styles.desc}>{product.description}</p>
        <div style={styles.footer}>
          <span style={styles.price}>₹{product.price.toLocaleString()}</span>
          <span style={{ fontSize: 12, color: outOfStock ? '#e74c3c' : '#27ae60' }}>
            {outOfStock ? 'Out of stock' : `${product.stock} left`}
          </span>
        </div>
        <button
          onClick={handleAdd}
          disabled={outOfStock || loading}
          style={{
            ...styles.btn,
            opacity: outOfStock ? 0.5 : 1,
            cursor: outOfStock ? 'not-allowed' : 'pointer',
          }}
        >
          <ShoppingCart size={16} />
          {loading ? 'Adding...' : 'Add to Cart'}
        </button>
      </div>
    </div>
  );
}

const styles = {
  card: { background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s' },
  imgWrap: { position: 'relative', height: 180, background: '#f5f5f5' },
  img: { width: '100%', height: '100%', objectFit: 'cover' },
  placeholder: { width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ccc', fontSize: 14 },
  outBadge: { position: 'absolute', top: 10, right: 10, background: '#e74c3c', color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: 11 },
  body: { padding: 16, display: 'flex', flexDirection: 'column', gap: 8, flex: 1 },
  name: { margin: 0, fontSize: 16, fontWeight: 600, color: '#222' },
  desc: { margin: 0, fontSize: 13, color: '#888' },
  footer: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 18, fontWeight: 700, color: '#6c63ff' },
  btn: { marginTop: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, background: '#6c63ff', color: '#fff', border: 'none', padding: '10px 16px', borderRadius: 10, fontSize: 14, fontWeight: 600, width: '100%' },
};