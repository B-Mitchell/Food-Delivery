'use client'; // Ensure the page is a client component
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; // Adjust the path as necessary
import Image from 'next/image';
import { useRouter } from 'next/navigation';

const MealsPage = () => {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState(''); 
  const router = useRouter();

  // Fetch all meals from Supabase
  useEffect(() => {
    const fetchMeals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase.from('meals').select('*');

        if (error) {
          throw error;
        }

        setMeals(data);
      } catch (error) {
        console.error('Error fetching meals:', error);
        setError('Error fetching meals. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  // Filter meals based on search term
  const filteredMeals = meals.filter(meal =>
    meal.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <p className="text-center mt-4">Loading meals...</p>;
  }

  if (error) {
    return <p className="text-red-500 text-center">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">All Meals</h1>

      {/* Search Input */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search for meals..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4">
        {filteredMeals.length === 0 ? (
          <p className="text-center">No meals found.</p>
        ) : (
          filteredMeals.map((meal) => (
            <div key={meal.id} className="bg-white relative shadow-lg rounded-lg p-4 flex flex-col border border-gray-300">
              {meal.image_url && (
                <Image
                  src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mealbucket/${meal.image_url}`}
                  width={400} height={400}
                  alt='meal image'
                  className="w-full h-48 object-cover rounded-t-lg mb-2"
                />
              )}
              <div className="flex flex-col items-start">
                <h3 className="text-xl font-bold mb-2">{meal.name}</h3>
                <p className="text-gray-600 mb-2">{meal.description}</p>
                <p className="text-lg font-semibold text-blue-600">Price: ${meal.price}</p>
              </div>

              <button onClick={() => router.push(`/meals/${meal.id}`)} className='bg-blue-600 text-white rounded-lg p-2 bottom-2'>place order</button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default MealsPage;
