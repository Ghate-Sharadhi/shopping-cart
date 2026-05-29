import React, { useEffect, useState } from 'react';
import ProductCard from '../components/ProductCard';
import API from '../api/axios';
import { Package } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCart } from '../context/CartContext';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selected, setSelected] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);
  const { fetchCart } = useCart();

  useEffect(() => {
    API.get('/products')
      .then(res => setProducts(res.data))
      .catch(() => setError('Failed to load products. Please try again.'))
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async () => {
    try {
      setAddingToCart(true);
      await API.post('/cart/add', {
        productId: selected._id,
        quantity: 1,
      });
      await fetchCart();
      toast.success(`${selected.name} added to cart!`);
      setSelected(null);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to add to cart');
    } finally {
      setAddingToCart(false);
    }
  };

  if (loading) return (
    <div style={styles.center}>
      <div style={styles.spinner} />
      <p>Loading products...</p>
    </div>
  );

  if (error) return (
    <div style={{ ...styles.center, color: '#e74c3c' }}>{error}</div>
  );

  if (products.length === 0) return (
    <div style={styles.center}>
      <Package size={64} color="#ddd" />
      <h3 style={{ color: '#aaa' }}>No products available</h3>
    </div>
  );

  // Product Detail Modal
  if (selected) return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <img
          src={selected.image}
          alt={selected.name}
          style={styles.modalImg}
        />
        <h2 style={styles.modalName}>{selected.name}</h2>
        <p style={styles.modalDesc}>{selected.description}</p>
        <div style={styles.modalRow}>
          <span style={styles.modalPrice}>
            ₹{selected.price.toLocaleString()}
          </span>
          <span style={{
            color: selected.stock === 0 ? '#e74c3c' : '#27ae60',
            fontSize: 14,
            fontWeight: 600,
          }}>
            {selected.stock === 0 ? 'Out of Stock' : `${selected.stock} in stock`}
          </span>
        </div>
        <div style={styles.btnRow}>
          <button
            style={styles.closeBtn}
            onClick={() => setSelected(null)}>
            ← Back
          </button>
          <button
            style={{
              ...styles.addBtn,
              opacity: selected.stock === 0 ? 0.5 : 1,
              cursor: selected.stock === 0 ? 'not-allowed' : 'pointer',
            }}
            disabled={selected.stock === 0 || addingToCart}
            onClick={handleAddToCart}>
            {addingToCart ? 'Adding...' : '🛒 Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      <div style={styles.header}>
        <h1 style={styles.title}>🛍️ Our Products</h1>
        <p style={styles.sub}>{products.length} items available</p>
      </div>
      <div style={styles.grid}>
        {products.map(p => (
          <div
            key={p._id}
            onClick={() => setSelected(p)}
            style={styles.cardWrapper}>
            <ProductCard product={p} />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  page: { maxWidth: 1100, margin: '0 auto', padding: '32px 20px' },
  header: { marginBottom: 32 },
  title: { margin: '0 0 4px', fontSize: 28, fontWeight: 700, color: '#222' },
  sub: { margin: 0, color: '#888' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 },
  cardWrapper: { cursor: 'pointer' },
  center: { display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '60vh', gap: 12, color: '#999' },
  spinner: { width: 40, height: 40, border: '4px solid #eee', borderTop: '4px solid #6c63ff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' },
  modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999, padding: 20 },
  modal: { background: '#fff', borderRadius: 20, padding: 32, maxWidth: 480, width: '100%', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' },
  modalImg: { width: '100%', height: 220, objectFit: 'cover', borderRadius: 12, marginBottom: 16 },
  modalName: { fontSize: 22, fontWeight: 700, margin: '0 0 8px', color: '#222' },
  modalDesc: { fontSize: 15, color: '#666', margin: '0 0 16px' },
  modalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  modalPrice: { fontSize: 24, fontWeight: 700, color: '#6c63ff' },
  btnRow: { display: 'flex', gap: 12 },
  closeBtn: { background: '#f0f0f0', border: 'none', padding: '12px 20px', borderRadius: 10, cursor: 'pointer', fontWeight: 600, fontSize: 14, color: '#555' },
  addBtn: { flex: 1, background: '#6c63ff', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: 10, fontWeight: 600, fontSize: 14 },
};