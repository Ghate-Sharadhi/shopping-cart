import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Package } from 'lucide-react';
import API from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import toast from 'react-hot-toast';

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { fetchCart } = useCart();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post('/auth/login', form);
      login(res.data.user, res.data.token);
      await fetchCart();
      toast.success(`Welcome back, ${res.data.user.name}!`);
      navigate('/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <div style={styles.logo}><Package size={40} color="#6c63ff" /></div>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.sub}>Sign in to TechCart</p>
        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.inputWrap}>
            <Mail size={18} style={styles.icon} />
            <input style={styles.input} type="email" placeholder="Email address"
              value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div style={styles.inputWrap}>
            <Lock size={18} style={styles.icon} />
            <input style={styles.input} type="password" placeholder="Password"
              value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading} style={styles.btn}>
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
        <p style={styles.link}>Don't have an account?{' '}
          <Link to="/register" style={{ color: '#6c63ff' }}>Sign up</Link>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: '100vh', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 },
  card: { background: '#fff', padding: '40px 36px', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.15)', width: '100%', maxWidth: 400, textAlign: 'center' },
  logo: { marginBottom: 8 },
  title: { margin: '0 0 4px', fontSize: 26, fontWeight: 700, color: '#222' },
  sub: { margin: '0 0 28px', color: '#888', fontSize: 14 },
  form: { display: 'flex', flexDirection: 'column', gap: 14 },
  inputWrap: { position: 'relative', display: 'flex', alignItems: 'center' },
  icon: { position: 'absolute', left: 14, color: '#aaa' },
  input: { width: '100%', padding: '13px 14px 13px 44px', border: '1.5px solid #e8e8e8', borderRadius: 10, fontSize: 14, outline: 'none', boxSizing: 'border-box' },
  btn: { background: '#6c63ff', color: '#fff', border: 'none', padding: '14px', borderRadius: 10, fontSize: 15, fontWeight: 600, cursor: 'pointer', marginTop: 6 },
  link: { marginTop: 20, fontSize: 14, color: '#888' },
};