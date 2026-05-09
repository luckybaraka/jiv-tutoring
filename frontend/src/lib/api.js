/**
 * Centralized API client.
 * Talks to the JIV Tutoring backend.
 */
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

async function request(path, options = {}) {
  const url = `${API_URL}${path}`;
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  };

  // Attach JWT for admin routes
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('jiv_admin_token');
    if (token && path.startsWith('/admin')) {
      headers.Authorization = `Bearer ${token}`;
    }
  }

  try {
    const res = await fetch(url, { ...options, headers });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      throw new Error(data.message || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    if (err.message === 'Failed to fetch') {
      throw new Error(
        'Could not connect to the server. Please check your internet connection.'
      );
    }
    throw err;
  }
}

export const api = {
  // Bookings
  createBooking: (payload) =>
    request('/bookings', { method: 'POST', body: JSON.stringify(payload) }),

  getBooking: (id) => request(`/bookings/${id}`),

  // Schedule
  getAvailableSlots: (date) =>
    request(`/schedule/available?date=${encodeURIComponent(date)}`),

  // Contact
  sendContact: (payload) =>
    request('/contact', { method: 'POST', body: JSON.stringify(payload) }),

  // News
  getNews: () => request('/news'),

  // Auth
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  // Admin
  adminListBookings: (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    return request(`/admin/bookings${params ? `?${params}` : ''}`);
  },
  adminStats: () => request('/admin/stats'),
  adminApprove: (id) => request(`/admin/bookings/${id}/approve`, { method: 'PATCH' }),
  adminReject: (id, reason) =>
    request(`/admin/bookings/${id}/reject`, {
      method: 'PATCH',
      body: JSON.stringify({ reason }),
    }),
  adminComplete: (id) =>
    request(`/admin/bookings/${id}/complete`, { method: 'PATCH' }),
  adminCancel: (id) => request(`/admin/bookings/${id}/cancel`, { method: 'PATCH' }),
};
