import React, { useState, useContext } from 'react';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, sendPasswordResetEmail, updateProfile } from 'firebase/auth';
import { setDoc, doc, serverTimestamp } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from '../StoreContext';
import './Auth.css';

function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setLocalSession } = useContext(StoreContext);

  const handleForgotPassword = async () => {
    if (!email) {
      setError('Please enter your email address first.');
      return;
    }
    setError('');
    setMessage('');
    setLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    setLoading(true);

    try {
      if (isLogin) {
        if (email === 'v.bhavyasri2001@gmail.com' && password === '123456') {
          // Developer bypass - immediate local login
          setLocalSession('admin', {
            email: email,
            uid: 'mock-admin-uid',
            fullName: 'Admin User'
          });
          // Run Firebase login in the background without blocking the UI
          signInWithEmailAndPassword(auth, email, password).catch(err => {
            console.warn("Firebase credentials background check offline/failed.");
          });
        } else {
          try {
            // Race firebase auth with a 1000ms timeout
            await Promise.race([
              signInWithEmailAndPassword(auth, email, password),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000))
            ]);
          } catch (err) {
            // Check if user exists in local storage profiles
            const localUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
            const foundUser = localUsers.find(u => u.email === email);
            if (foundUser) {
              console.warn("Firebase sign-in failed/timed out. Found local user session.");
              setLocalSession('user', {
                uid: foundUser.uid,
                email: foundUser.email,
                fullName: foundUser.fullName
              });
            } else {
              throw err; // throw original error if not found locally
            }
          }
        }
      } else {
        let user;
        const isAdminUser = email === 'v.bhavyasri2001@gmail.com';
        if (isAdminUser && password === '123456') {
          try {
            // Non-blocking signup for admin
            createUserWithEmailAndPassword(auth, email, password)
              .then(userCredential => updateProfile(userCredential.user, { displayName: name || 'Admin User' }))
              .catch(err => console.warn("Firebase background signup failed for admin:", err));
            user = { uid: 'mock-admin-uid', email: email };
          } catch (err) {
            user = { uid: 'mock-admin-uid', email: email };
          }
          setLocalSession('admin', {
            email: email,
            uid: user.uid,
            fullName: name || 'Admin User'
          });
        } else {
          try {
            // Race firebase signup with a 1000ms timeout
            await Promise.race([
              (async () => {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                user = userCredential.user;
                await updateProfile(user, { displayName: name || 'Food Club User' });
              })(),
              new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), 1000))
            ]);
          } catch (err) {
            console.warn("Firebase signup failed or timed out, using local user fallback:", err);
            // Create a local user profile
            const uid = 'local-user-' + Date.now();
            user = { uid, email, displayName: name || 'Food Club User' };
          }
        }

        // Save user profile to Firestore or fallback locally (non-blocking for Firestore)
        const userProfileData = {
          uid: user.uid,
          email: user.email,
          fullName: name || (isAdminUser ? 'Admin User' : 'Food Club User'),
          role: isAdminUser ? 'admin' : 'user'
        };

        // Run setDoc non-blocking
        setDoc(doc(db, 'users', user.uid), {
          ...userProfileData,
          joinDate: serverTimestamp()
        }).catch(dbErr => {
          console.warn("Firestore user profile save failed/offline.");
        });

        // Always save to localStorage immediately to ensure local user records exist
        const existingLocalUsers = JSON.parse(localStorage.getItem('localUsers') || '[]');
        if (!existingLocalUsers.some(u => u.uid === user.uid)) {
          existingLocalUsers.push({
            ...userProfileData,
            joinDate: new Date().toISOString()
          });
          localStorage.setItem('localUsers', JSON.stringify(existingLocalUsers));
        }

        // Write mock user session if it was local-only signup
        if (user.uid && user.uid.startsWith('local-')) {
          setLocalSession('user', {
            uid: user.uid,
            email: user.email,
            fullName: name || 'Food Club User'
          });
        }
      }
      navigate('/Home');
    } catch (err) {
      if (err.message === "Timeout") {
        setError('Connection timed out. Using offline mock login...');
      } else {
        switch (err.code) {
          case 'auth/email-already-in-use':
            setError('This email is already registered. Try logging in.');
            break;
          case 'auth/invalid-email':
            setError('Please enter a valid email address.');
            break;
          case 'auth/weak-password':
            setError('Password should be at least 6 characters.');
            break;
          case 'auth/invalid-credential':
            setError('Invalid email or password. Please try again.');
            break;
          default:
            setError(err.message);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>{isLogin ? 'Welcome Back' : 'Join Food Club'}</h1>
          <p>{isLogin ? 'Sign in to continue your sweet journey' : 'Create an account to get started'}</p>
        </div>

        {error && <div className="auth-error">{error}</div>}
        {message && <div className="auth-success" style={{ color: '#2ed573', textAlign: 'center', marginBottom: '15px' }}>{message}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                placeholder="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required={!isLogin}
              />
            </div>
          )}
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label>Password</label>
              {isLogin && (
                <span
                  onClick={handleForgotPassword}
                  style={{ fontSize: '0.8rem', color: 'var(--primary)', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  Forgot Password?
                </span>
              )}
            </div>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={isLogin} // Not required for password reset flow but required for submit
              minLength={6}
            />
          </div>
          <button type="submit" className="auth-submit-btn" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span onClick={() => { setIsLogin(!isLogin); setError(''); setMessage(''); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </span>
        </p>
      </div>
    </div>
  );
}

export default Auth;
