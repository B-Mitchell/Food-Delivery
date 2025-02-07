'use client';
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; // Adjust the path as necessary
import { useUser } from '@clerk/nextjs';
import Image from 'next/image';

const MealsPage = () => {
  const { user } = useUser();
  const [meals, setMeals] = useState([]);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false); // State to toggle form visibility
  const [handleLoading, setHandleLoading] = useState(false);
  const [businessName, setBusinessName] = useState(''); // State for business name

  // Fetch meals and business name from Supabase
  useEffect(() => {
    const fetchMealsAndBusinessName = async () => {
      setHandleLoading(true);
      if (user) {
        // Fetch meals
        const { data: mealsData, error: mealsError } = await supabase
          .from('meals')
          .select('*')
          .eq('vendor_id', user.id);

        if (mealsError) {
          console.error('Error fetching meals:', mealsError);
        } else {
          setMeals(mealsData);
        }

        // Fetch vendor's business name
        const { data: userData, error: userError } = await supabase
          .from('users')
          .select('business_name')
          .eq('clerk_id', user.id)
          .single();

        if (userError) {
          console.error('Error fetching business name:', userError);
        } else {
          setBusinessName(userData.business_name);
        }
      }
      setHandleLoading(false);
    };
    console.log(businessName);
    fetchMealsAndBusinessName();
  }, [user, businessName]);

  const handleCreateMeal = async () => {
    setLoading(true);
    setError(null);

    try {
      // Check if the user has uploaded an image
      if (!imageFile) throw new Error('Please upload an image');

      // Generate a unique image path based on the user ID and file name
      const imagePath = `meals/${user.id}_${imageFile.name}`;

      // Upload image to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from('mealbucket')
        .upload(imagePath, imageFile);

      if (uploadError) throw uploadError;

      // Insert meal data into the database, including the image file path and business name
      const { error } = await supabase
        .from('meals')
        .insert([
          {
            name,
            description,
            price: parseFloat(price),
            vendor_id: user.id,
            image_url: imagePath, // Store the image path in the database
            business_name: businessName, // Include business name
          },
        ]);

      if (error) throw error;

      alert('Meal created successfully!');
      setMeals([...meals, { name, description, price, vendor_id: user.id, image_url: imagePath, businessName }]); // Update local state
      setName('');
      setDescription('');
      setPrice('');
      setImageFile(null);
      
    } catch (error) {
      console.error(error);
      setError('Error creating meal: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Toggle form visibility
  const toggleFormVisibility = () => {
    setIsFormVisible(!isFormVisible);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      {businessName === null ? <p >you are not a vendor, please login and create an account as a vendor.</p> :
      <div >
      <h1 className="text-3xl font-bold mb-6">Your Meals</h1>
      {error && <p className="text-red-500">{error}</p>}

      {/* Toggle Button */}
      <button
        onClick={toggleFormVisibility}
        className="mb-4 py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        {isFormVisible ? 'Close' : 'Create Meal'}
      </button>

      {/* Create Meal Form */}
      {isFormVisible && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Create New Meal</h2>
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Meal Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Price</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Image</label>
              <input
                type="file"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
                required
              />
            </div>
            <button
              type="button"
              onClick={handleCreateMeal}
              className={`w-full py-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
              disabled={loading}
            >
              {loading ? 'Creating...' : 'Create Meal'}
            </button>
          </form>
        </div>
      )}

      <h2 className="text-xl font-semibold mb-4">Posted Meals</h2>
      {handleLoading && <p className='text-center mt-1 mb-1'>Loading...</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {meals.length === 0 ? (
          <p>No meals posted yet.</p>
        ) : (
          meals.map((meal) => (
            <div key={meal.id} className="bg-white shadow-lg rounded-lg p-4 mb-6 flex flex-col items-center border border-gray-300">
              {meal.image_url && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mealbucket/${meal.image_url}`}
                  width={400} height={400}
                  alt={meal.name}
                  className="w-full h-48 object-cover rounded-t-lg"
                />
              )}
              <div className="p-2 text-left w-[100%]">
                <h3 className="text-xl font-bold mb-2">{meal.name}</h3>
                <p className="text-gray-600 mb-2">{meal.description}</p>
                <p className="text-lg font-semibold text-blue-600">Price: ${meal.price}</p>
                <p className="text-sm text-gray-500">Vendor: {meal.businessName}</p> 
              </div>
            </div>
          ))
        )}
      </div>
    </div>}
    </div>
  );
};

export default MealsPage;
