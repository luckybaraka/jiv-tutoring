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

  /** Returns { available: bool, conflict: { startAt, endAt, timezone } | null } */
  checkAvailability: ({ startAt, durationMinutes = 45 }) => {
    const params = new URLSearchParams({
      startAt,
      durationMinutes: String(durationMinutes),
    }).toString();
    return request(`/bookings/availability?${params}`);
  },

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
  forgotPassword: (email) =>
    request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, password) =>
    request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password }),
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
  adminDelete: (id) => request(`/admin/bookings/${id}`, { method: 'DELETE' }),

  /**
   * Triggers a browser download of the bookings Excel file.
   * Returns the filename used or throws on failure.
   */
  adminExportExcel: async (filters = {}) => {
    const params = new URLSearchParams(filters).toString();
    const url = `${API_URL}/admin/bookings/export${params ? `?${params}` : ''}`;
    const token =
      typeof window !== 'undefined'
        ? localStorage.getItem('jiv_admin_token')
        : null;

    const res = await fetch(url, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err.message || `Export failed (${res.status})`);
    }

    const blob = await res.blob();
    const filename =
      res.headers
        .get('Content-Disposition')
        ?.match(/filename="?([^"]+)"?/)?.[1] ||
      `jiv-bookings-${new Date().toISOString().split('T')[0]}.xlsx`;

    const blobUrl = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = blobUrl;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(blobUrl);

    return filename;
  },
};
