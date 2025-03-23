@import url('https://fonts.googleapis.com/css2?family=Poppins&display=swap');

:root {
  --primary-yellow: #FFC107;
  --black: #000000;
  --white: #ffffff;
  --gray-light: #f4f7fa;
  --gray-dark: #333333;
  --bg-color: var(--gray-light);
  --text-color: var(--gray-dark);
  --box-bg: var(--white);
}

body.dark {
  --bg-color: #121212;
  --text-color: #e0e0e0;
  --box-bg: #1e1e1e;
}

body {
  font-family: 'Poppins', sans-serif;
  background-color: var(--bg-color);
  color: var(--text-color);
  margin: 0;
  padding: 20px;
}

/* Navbar */
.navbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--black);
  color: var(--white);
  padding: 15px 25px;
  border-radius: 8px;
  margin-bottom: 30px;
  position: relative;
}

.desktop-nav-links {
  display: flex;
  gap: 25px; /* ✅ Fixed spacing */
}

.navbar a {
  color: var(--white);
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  cursor: pointer;
}

.navbar a:hover {
  text-decoration: underline;
}

/* Hamburger Icon */
.hamburger {
  display: none;
  font-size: 30px;
  cursor: pointer;
}

.mobile-nav-links {
  background-color: #222;
  padding: 15px;
  display: none;
  flex-direction: column;
  position: absolute;
  top: 65px;
  right: 15px;
  width: 250px;
  border-radius: 8px;
  z-index: 10;
}

.mobile-nav-active {
  display: flex;
}

.mobile-nav-links a {
  color: white;
  padding: 10px 0;
  text-decoration: none;
  font-weight: 500;
}

.mobile-nav-links a:hover {
  background-color: #333;
}

/* Containers */
.auth-container, .dashboard-container {
  width: 95%;
  max-width: 900px;
  margin: 30px auto;
  background: var(--box-bg);
  padding: 35px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
}

h1, h2, h3 {
  color: var(--black);
}

button {
  background-color: var(--primary-yellow);
  color: var(--black);
  padding: 12px 25px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
  margin: 10px 0;
}

button:hover {
  background-color: #e6ac06;
}

input[type="text"],
input[type="email"],
input[type="password"],
input[type="number"],
input[type="file"] {
  width: 100%;
  padding: 14px;
  margin: 12px 0;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 1rem;
  background: var(--box-bg);
  color: var(--text-color);
}

.profile-section img {
  width: 150px;
  height: 150px;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid var(--primary-yellow);
  margin-bottom: 15px;
}

/* Campaign Boxes */
.campaign-box {
  background: var(--gray-light);
  padding: 20px;
  border-radius: 10px;
  margin: 15px 0;
}

.image-placeholder {
  width: 100%;
  height: 180px;
  border: 2px dashed var(--primary-yellow);
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--gray-dark);
  margin-top: 10px;
}

.invest-amount-container {
  display: flex;
  align-items: center;
  gap: 15px;
  justify-content: center;
  margin: 20px 0;
}

.invest-amount-container button {
  font-size: 1.5rem;
}

.terms-box {
  max-height: 300px;
  overflow-y: auto;
  border: 1px solid #ccc;
  padding: 15px;
  background: var(--gray-light);
  margin-bottom: 20px;
}

.thank-you-container {
  width: 95%;
  max-width: 700px;
  margin: 60px auto;
  padding: 40px;
  background: var(--box-bg);
  border-radius: 12px;
  text-align: center;
  box-shadow: 0 8px 20px rgba(0,0,0,0.1);
}

.thank-you-container h1 {
  color: var(--primary-yellow);
  font-size: 2.5rem;
  margin-bottom: 25px;
}

.summary-box {
  background-color: #fffbe6;
  padding: 25px;
  border-radius: 10px;
  margin: 25px 0;
  text-align: left;
  font-size: 1.1rem;
}

.summary-box p {
  margin-bottom: 12px;
}

/* Dashboard grid layout - ✅ Adjusted width to match your reference */
.dashboard-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 20px;
  justify-content: center;
}

.dashboard-box {
  width: 350px;
  background: var(--white);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0,0,0,0.1);
  text-align: center;
}

@media (max-width: 768px) {
  .dashboard-box {
    width: 100%;
  }
}

/* Mobile Responsive */
@media screen and (max-width: 768px) {
  .hamburger {
    display: block;
  }

  .desktop-nav-links {
    display: none;
  }

  .dashboard-container {
    padding: 20px;
  }

  .profile-section img {
    width: 120px;
    height: 120px;
  }
}
