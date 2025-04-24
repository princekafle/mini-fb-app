
import { create } from 'zustand';
import axios from 'axios';

const BASE_URL = 'http://localhost:8000';

const useAuthStore = create((set) => ({
  user: null,
  token: null,
  isLoggedIn: false,

  initAuth: () => {
    if (typeof window !== 'undefined') {
      const user = JSON.parse(localStorage.getItem('user') || 'null');
      const token = localStorage.getItem('token');
      set({ user, token, isLoggedIn: !!token });

      
    }
  },

 

  login: async ({ identifier, password }) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/auth/login/`, {
        identifier, // identifier to send email or pw to backend 
        password,
      });

      const data = response.data;

      // Save token and user to localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));

      set({
        user: data,
        token: data.token,
        isLoggedIn: true,
      });
      localStorage.setItem('IsLoggedin', true);

      return { success: true };

    } catch (error) {
      console.error('Login error:', error);
      const errorMsg = error.response?.data?.message || 'Login failed';

      // Set isLoggedIn to false on login failure
      set({ isLoggedIn: false });
      localStorage.setItem('IsLoggedin', false);
      localStorage.removeItem('token'); // Optionally clear potentially invalid token
      localStorage.removeItem('user');  // Optionally clear potentially invalid user data

      return { success: false, message: errorMsg };
    }
  },

  signup: async ({firstName, lastName, email,birthDay, birthMonth,birthYear,gender,identifier,password}) => {
    try {
      const formData = {
        firstName, lastName, email,birthDay, birthMonth,birthYear,gender,identifier,password
      }

      const response = await axios.post(`${BASE_URL}/api/auth/register`, formData);


      const data = response.data;

      localStorage.setItem('user', JSON.stringify(data));
      localStorage.setItem('token', data.token);
      // localStorage.setItem('isAuthenticated', 'true');

      set({
        user: data,
        token: data.token,
        isLoggedIn: false,
      });

      return { success: true };
    } catch (error) {
      console.error('Signup error:', error);
      const errorMsg = error.response?.data?.message || 'Signup failed';
      return { success: false, message: errorMsg };
    }
  },

  logout: async () => {
    try {
      await axios.post(`${BASE_URL}/api/auth/logout/`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.setItem('IsLoggedin', false);
      set({ user: null, token: null, isLoggedIn: false });

      return true;
    } catch (error) {
      console.error('Logout error:', error);
      return false;  // optionally return false on error
    }
  },


  // logic for update user 

  updateUser: async (updatedData) => {
    const { user, token } = useAuthStore.getState(); // Get user and token from store
    const id = user.id;
    console.log(id)
    try {
      const res = await axios.put(`${BASE_URL}/api/users/${id}`, updatedData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      set((state) => ({
        user: { ...state.user, ...res.data },
      }));
    } catch (err) {
      console.error('Update profile failed', err);
    }
  },


  uploadProfileImage: async (file) => {
    const formData = new FormData(); // for form-data in backend to upload image
    formData.append('image', file);

    try {
      const res = await axios.post(`${BASE_URL}/api/users/profile/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });

      set((state) => ({
        user: { ...state.user, profileImageUrl: res.data.profileImageUrl },
      }));
    } catch (err) {
      console.error('Image upload failed', err);
    }
  },

  getUserbyId: async () => {
    const { user, token } = useAuthStore.getState(); // Get user and token from store
    const id = user.id;
    try {
     
      if (!user || ! id) {
        throw new Error('User ID not available');
      }
  
      const response = await axios.get(`${BASE_URL}/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const updatedUser = response.data;
  
      set({ user: updatedUser }); // ✅ Update user in store
  
      return updatedUser;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      return null;
    }
  },


}));

export default useAuthStore;
