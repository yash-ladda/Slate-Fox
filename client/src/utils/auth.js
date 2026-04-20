// Get token safely
export const getToken = () => {
  const token = localStorage.getItem('token');
  return token && token !== 'undefined' && token !== '' ? token : null;
};

// Set token safely
export const setToken = (token) => {
  if (token && typeof token === 'string') {
    localStorage.setItem('token', token);
  }
};

// Remove token
export const removeToken = () => {
  localStorage.removeItem('token');
};

// Check auth
export const isAuthenticated = () => {
  return !!getToken();
};

// Get user safely
export const getUser = () => {
  try {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  } catch (error) {
    console.error('Invalid user in localStorage');
    return null;
  }
};

// Set user safely
export const setUser = (user) => {
  if (user && typeof user === 'object') {
    localStorage.setItem('user', JSON.stringify(user));
  }
};

// Logout (clear everything)
export const logout = () => {
  removeToken();
  localStorage.removeItem('user');
};

// OPTIONAL: decode JWT safely (no crash)
export const getTokenPayload = () => {
  const token = getToken();
  if (!token) return null;

  try {
    if (!token) return null;
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch (error) {
    console.error('Invalid token');
    return null;
  }
};