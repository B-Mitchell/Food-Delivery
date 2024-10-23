'use client';
import { useEffect, useState } from 'react';
import { useUser, SignInButton, SignedOut } from '@clerk/nextjs'; // Clerk for authentication
import { supabase } from '../supabase'; // Adjust the path as necessary
import { useRouter } from 'next/navigation';

export default function Profile() {
    const router = useRouter();
  const { user, isSignedIn } = useUser();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [userType, setUserType] = useState('user'); // Default to 'user'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [vendorData, setVendorData] = useState({
    businessName: '',
    phone: '',
    address: '',
    kyc_verified: false,
  });
  const [userDataExists, setUserDataExists] = useState(false); // Track if user data exists

  // Fetch user data from Supabase
  useEffect(() => {
    const fetchUserData = async () => {
      if (isSignedIn && user) {
        setEmail(user.emailAddresses[0].emailAddress);
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('*')
          .eq('clerk_id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching user data:', userError);
        } else if (userData) {
          setUserDataExists(true); // Mark that user data exists
          setName(userData.full_name || '');
          setEmail(userData.email || '');
          setUserType(userData.type || 'user'); // Set user type from database
          
          // Set vendor data if the user is a vendor
          if (userData.type === 'vendor') {
            setVendorData({
              businessName: userData.business_name || '',
              phone: userData.phone || '',
              address: userData.address || '',
              kyc_verified: userData.kyc_verified || false
            });
          }
        }
      }
    };

    fetchUserData();
  }, [isSignedIn, user]);

  const handleUpdateProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase
        .from('users')
        .upsert({ 
          clerk_id: user.id,
          full_name: name,
          email,
          type: userType,
          business_name: userType === 'vendor' ? vendorData.businessName : null,
          phone: userType === 'vendor' ? vendorData.phone : null,
          address: userType === 'vendor' ? vendorData.address : null,
        });

      if (error) throw error;

      alert('Profile updated successfully!');
      setUserDataExists(true); // Mark data as existing after creation
    } catch (error) {
      setError('Error updating profile: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 bg-gray-50 rounded-lg shadow-md">
      <h1 className="text-3xl font-bold mb-6 text-center">User Profile</h1>
      {error && <p className="text-red-500">{error}</p>}
      {!isSignedIn ? (
        <div className="bg-white shadow-md rounded-lg p-6 text-center">
          <h2 className="text-xl font-semibold mb-4">Please Log In</h2>
          <p className="text-gray-700">You must be logged in to view your profile.</p>
          <SignedOut>
            <SignInButton mode="modal" className="mt-4 bg-blue-600 text-white rounded-md px-4 py-2">Sign in {/* Modal login */}
            </SignInButton>
          </SignedOut>
        </div>
      ) : userDataExists ? (
        <div className="bg-white shadow-md rounded-lg p-6 relative">
            {vendorData.kyc_verified ? null : <button onClick={() => router.push('/profile/verify')} className='text-right text-blue-600 absolute top-0 right-0 hover:border-blue-600 hover:bg-white hover:text-black'>do your KYC Verification</button>}
  <h2 className="text-xl font-semibold mb-6">Profile Information</h2>
  <div className="mb-4">
    <strong className="text-gray-700">Full Name:</strong>
    <p className="text-gray-900">{name}</p>
  </div>
  <div className="mb-4">
    <strong className="text-gray-700">Email:</strong>
    <p className="text-gray-900">{email}</p>
  </div>
  <div className="mb-4">
    <strong className="text-gray-700">User Type:</strong>
    <p className="text-gray-900">{userType}</p>
  </div>
  
  {userType === 'vendor' && (
    <div className="border-t border-gray-300 mt-6 pt-4">
      <h3 className="text-lg font-semibold mb-4">Vendor Information</h3>
      <div className="mb-4">
        <strong className="text-gray-700">Business Name:</strong>
        <p className="text-gray-900">{vendorData.businessName}</p>
      </div>
      <div className="mb-4">
        <strong className="text-gray-700">Phone:</strong>
        <p className="text-gray-900">{vendorData.phone}</p>
      </div>
      <div className="mb-4">
        <strong className="text-gray-700">Address:</strong>
        <p className="text-gray-900">{vendorData.address}</p>
      </div>
    </div>
  )}
  
  <div className="mt-6 w-[100%] flex justify-between">
    {userType === 'user' ? null : <button 
      onClick={() => router.push('/profile/meals')}
      className="w-[45%] py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200"
    >
      View Meals
    </button>}
    <button 
      onClick={() => router.push('/profile/deliveries')}
      className={`${userType === 'user' ? 'w-full' : 'w-[45%]'} py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-200`}
    >
      View deliveries
    </button>
  </div>
</div>

      ) : (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Create Your Profile</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                required
                disabled
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">User Type</label>
              <select
                value={userType}
                onChange={(e) => {
                  setUserType(e.target.value);
                  if (e.target.value === 'user') {
                    // Clear vendor data when switching back to user
                    setVendorData({ businessName: '', phone: '', address: '' });
                  }
                }}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="user">User</option>
                <option value="vendor">Vendor</option>
              </select>
            </div>
            {userType === 'vendor' && (
              <div className="border-t border-gray-300 mt-6 pt-4">
                <h3 className="text-lg font-semibold">Vendor Information</h3>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mt-3">Business Name</label>
                  <input
                    type="text"
                    value={vendorData.businessName}
                    onChange={(e) => setVendorData({ ...vendorData, businessName: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <input
                    type="text"
                    value={vendorData.phone}
                    onChange={(e) => setVendorData({ ...vendorData, phone: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">Address</label>
                  <input
                    type="text"
                    value={vendorData.address}
                    onChange={(e) => setVendorData({ ...vendorData, address: e.target.value })}
                    className="mt-1 block w-full border border-gray-300 rounded-md p-2 focus:ring-blue-500 focus:border-blue-500"
                    required
                  />
                </div>
              </div>
            )}
            <button
              type="button"
              onClick={handleUpdateProfile}
              className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Updating...' : 'Create Profile'}
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
