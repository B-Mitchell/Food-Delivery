'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; 
import Image from 'next/image';
import { useClerk } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';

const CheckoutPage = ({ params }) => {
  const { checkout } = params; // This is the meal ID
  const { user } = useClerk();
  const router = useRouter();
  const [meal, setMeal] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [userInfo, setUserInfo] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });
  const [userType, setUserType] = useState(null); // State to hold the user type

  useEffect(() => {
    const fetchMeal = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('meals')
          .select('*')
          .eq('id', checkout)
          .single();

        if (error) {
          throw error;
        }

        setMeal(data); //stores the fetched meal in usestate
      } catch (error) {
        console.error('Error fetching meal:', error);
        setError('Error fetching meal. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    const fetchUserType = async () => {
      try {
        const { data, error } = await supabase
          .from('users') 
          .select('type') // field name for user type
          .eq('clerk_id', user.id)
          .single();

        if (error) {
          throw error;
        }

        setUserType(data.type);
      } catch (error) {
        console.error('Error fetching user type:', error);
        setError('Error fetching user type. Please update your profile.');
      }
    };

    fetchMeal();
    if (user) {
      fetchUserType();
    }
  }, [checkout, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInfo((prevInfo) => ({ ...prevInfo, [name]: value }));
  };

  const handleOrderSubmit = async () => {
    // Insert the order information into the deliveries table
    try {
      const { data, error } = await supabase
        .from('deliveries')
        .insert([{
          vendor_id: meal.vendor_id, // Assuming you have this field in the meals table
          user_id: user.id,
          meal_id: meal.id,
          buyer_name: userInfo.name,
          buyer_email: userInfo.email,
          buyer_phone: userInfo.phone,
          delivery_address: userInfo.address,
          vendor_name: meal.business_name,
          meal_name: meal.name,
          status: 'Pending', // Initial status for the delivery
          estimated_time: '30 minutes', // Set your estimated delivery time
        }]);

      if (error) throw error;

      alert('Order placed successfully!');
      // Optionally, redirect to the delivery tracking page
      // window.location.href = `/delivery-tracking/${data[0].id}`; // Redirect to the delivery tracking page with the delivery ID
      router.push('/profile/deliveries');

    } catch (error) {
      console.error('Error placing order:', error);
      alert('Error placing order. Please try again later.');
    }
  };

  if (loading) {
    return <p className="text-center mt-4">Loading meal details...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center mt-4">{error}</p>;
  }

  // Check user type
  if (userType === null) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-500 text-center">
          Please update your profile to access this feature.
        </p>
      </div>
    );
  }

  if (userType === 'vendor') {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <p className="text-red-500 text-center">
          Vendors cannot place orders.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Checkout</h1>

      {/* Selected Meal Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold">{meal.name}</h2>
        {meal.image_url && (
          <Image
            src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mealbucket/${meal.image_url}`}
            width={400} height={300}
            alt={meal.name}
            className="w-full h-48 object-cover rounded-md mb-2"
          />
        )}
        <p>{meal.description}</p>
        <p className="text-lg font-semibold text-blue-600">Price: ${meal.price}</p>
      </div>

      {/* User Information Form */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">Your Information</h2>
        <form>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={userInfo.name}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={userInfo.email}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="text"
              name="phone"
              value={userInfo.phone}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">Address</label>
            <textarea
              name="address"
              value={userInfo.address}
              onChange={handleInputChange}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              required
            />
          </div>
        </form>
      </div>

      {/* Payment Information */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-4">
        <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
        <p className="text-gray-600">Total: ${meal.price}</p>
        {/* Add your payment form logic here */}
      </div>

      {/* Confirmation Button */}
      <button
        onClick={handleOrderSubmit}
        className="w-full py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition duration-300"
      >
        Confirm Order
      </button>
    </div>
  );
};

export default CheckoutPage;
