import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, LogOut, Package, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav style={styles.nav}>
      <Link to="/products" style={styles.brand}>
        <Package size={26} color="#6c63ff" />
        <span style={styles.brandText}>TechCart</span>
      </Link>

      {user && (
        <div style={styles.right}>
          <div style={styles.userInfo}>
            <User size={16} color="#6c63ff" />
            <span style={styles.userName}>{user.name}</span>
          </div>

          <Link to="/cart" style={styles.cartWrap}>
            <ShoppingCart size={22} color="#333" />
            {totalItems > 0 && (
              <span style={styles.badge}>{totalItems}</span>
            )}
          </Link>

          <button onClick={handleLogout} style={styles.logoutBtn}>
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>
      )}
    </nav>
  );
}

const styles = {
  nav: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 32px',
    background: '#fff',
    boxShadow: '0 2px 10px rgba(0,0,0,0.08)',
    position: 'sticky',
    top: 0,
    zIndex: 100,
  },
  brand: {
    display: 'flex',
    alignItems: 'center',
    gap: 8,
    textDecoration: 'none',
  },
  brandText: {
    fontSize: 22,
    fontWeight: 700,
    color: '#6c63ff',
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: 20,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: '#f3f0ff',
    padding: '6px 14px',
    borderRadius: 20,
  },
  userName: {
    fontSize: 14,
    fontWeight: 600,
    color: '#6c63ff',
  },
  cartWrap: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    color: '#333',
  },
  badge: {
    position: 'absolute',
    top: -8,
    right: -8,
    background: '#6c63ff',
    color: '#fff',
    borderRadius: '50%',
    fontSize: 11,
    width: 18,
    height: 18,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
  },
  logoutBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    background: 'none',
    border: '1.5px solid #ddd',
    padding: '6px 14px',
    borderRadius: 8,
    cursor: 'pointer',
    color: '#555',
    fontSize: 14,
    fontWeight: 500,
  },
};