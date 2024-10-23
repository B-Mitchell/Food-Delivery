'use client'; // Ensure this page is a client component
import React, { useState } from 'react';
import { supabase } from '@/app/supabase'; // Adjust the path as necessary
import { useUser } from '@clerk/nextjs';

const KYCVerificationPage = () => {
  const { user } = useUser();
  const [fullName, setFullName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleKYCSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      // Update KYC verification data in the users table
      const { error } = await supabase
        .from('users')
        .update({
          full_name: fullName,
          address,
          phone,
          kyc_verified: true, // Set KYC verified status to true
        })
        .eq('clerk_id', user.id);

      if (error) throw error;

      setSuccess(true);
      setFullName('');
      setAddress('');
      setPhone('');
    } catch (error) {
      console.error('Error during KYC verification:', error);
      setError('Error during KYC verification. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">KYC Verification</h1>
      {error && <p className="text-red-500">{error}</p>}
      {success && <p className="text-green-500">KYC verification submitted successfully!</p>}

      <form onSubmit={handleKYCSubmit}>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Full Name</label>
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Phone Number</label>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            required
          />
        </div>
        <button
          type="submit"
          className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit KYC'}
        </button>
      </form>
    </div>
  );
};

export default KYCVerificationPage;
