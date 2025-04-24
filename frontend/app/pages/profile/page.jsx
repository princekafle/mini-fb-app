"use client"
import React, { useEffect, useState } from 'react';
import useAuthStore from '@/store/authStore';
import toast from 'react-hot-toast';

const Profile = () => {
  const { user, getUserbyId, updateUser, uploadProfileImage } = useAuthStore();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    street: '',
    city: '',
    province: '',
    country: '',
  });

  useEffect(() => {
    const fetchData = async () => {
      const updatedUser = await getUserbyId();
      if (updatedUser) {
        setFormData({
          name: updatedUser.name || '',
          phone: updatedUser.phone || '',
          // street: updatedUser.address?.street || '',
          // city: updatedUser.address?.city || '',
          // province: updatedUser.address?.province || '',
          // country: updatedUser.address?.country || '',
        });
      }
    };

    fetchData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleImageChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadProfileImage(file);
      toast.success("Profile picture updated!");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const updatedData = {
      name: formData.name,
      phone: formData.phone,
      // address: {
      //   street: formData.street,
      //   city: formData.city,
      //   province: formData.province,
      //   country: formData.country,
      // },
    };

    await updateUser(updatedData);
    toast.success("Profile updated successfully!");
  };

  if (!user) return <p>Loading...</p>;

  return (
    <div className="max-w-md mx-auto p-4 border rounded-md shadow-md mt-8">
      <h2 className="text-xl font-bold mb-4">Your Profile</h2>

      <div className="mb-4">
        <img
          src={user.profileImageUrl || 'https://via.placeholder.com/100'}
          alt="Profile"
          className="w-24 h-24 rounded-full object-cover mb-2"
        />
        <input type="file" accept="image/*" onChange={handleImageChange} />
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm font-medium">Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Email (read-only)</label>
          <input
            type="email"
            value={user.email}
            readOnly
            className="w-full border px-3 py-2 rounded bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Phone</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Street</label>
          <input
            type="text"
            name="street"
            value={formData.street}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">City</label>
          <input
            type="text"
            name="city"
            value={formData.city}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Province</label>
          <input
            type="text"
            name="province"
            value={formData.province}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div>
          <label className="block text-sm font-medium">Country</label>
          <input
            type="text"
            name="country"
            value={formData.country}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          Update Profile
        </button>
      </form>
    </div>
  );
};

export default Profile;
