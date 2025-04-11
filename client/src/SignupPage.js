import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSignup = async () => {
    try {
      const res = await axios.post('https://landing-page-gere.onrender.com/signup', { name, email, password });
      alert(res.data.message);

      // ✅ Store email for verification or pass it to /verify if needed
      localStorage.setItem('pendingEmail', email);

      // ✅ Redirect to /verify page after successful signup
      navigate('/verify');
    } catch (err) {
      alert(err.response?.data?.message || 'Signup failed');
    }
  };

    // Image slider setup
  const images = [
    '/images/Campaign.jpg',  // image filenames
    '/images/Pre-register.jpg',
    '/images/invest.jpg'
  ];

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
    }, 3000); // ✅ Change image every 3 seconds
    return () => clearInterval(interval);
  }, []);

  return (
  <div className="auth-wrapper"> 
      <div className="auth-image-slider">
        <img src={images[currentImage]} alt="Slider" />
      </div>
  
      <div className="auth-container">
      <h2>Create Account</h2>
      <input type="text" placeholder="Full Name" value={name} onChange={e => setName(e.target.value)} />
      <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
      <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
      <button onClick={handleSignup}>Sign Up</button>

      <p>
        Already have an account? 
        <span onClick={() => navigate('/')} style={{ color: 'blue', cursor: 'pointer' }}> Login</span>
      </p>
    </div>
  </div>
  );
};

export default SignupPage;
