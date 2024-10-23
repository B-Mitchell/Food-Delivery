'use client'; // Ensure the page is a client component
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; // Adjust the path as necessary
import Image from 'next/image';
import heroImage from '../public/hero-img.jpg';
import { useRouter } from 'next/navigation';

const HomePage = () => {
  const [featuredMeals, setFeaturedMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchFeaturedMeals = async () => {
      setLoading(true);
      try {
        const { data, error } = await supabase
          .from('meals')
          .select('*')
          .limit(6); // Fetching limited meals for featured section

        if (error) {
          throw error;
        }

        setFeaturedMeals(data);
      } catch (error) {
        console.error('Error fetching featured meals:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedMeals();
  }, []);

  return (
    <div className="bg-gray-50">
      {/* Hero Section */}
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative w-full h-[50vh] md:h-[60vh]">
  <Image 
    src={heroImage} 
    alt="Hero Image" 
    layout="fill" 
    objectFit="cover" 
    quality={100}
    className="absolute inset-0"
  />
  <div className="relative container mx-auto text-center px-6 flex flex-col items-center justify-center h-full z-10">
    <h1 className="text-3xl md:text-6xl font-bold text-white mb-4">Delicious Meals Delivered to You</h1>
    <button onClick={() => router.push('/meals')} className="block ml-4 bg-blue-600 text-white px-4 py-2 rounded">Order Now</button>
  </div>
  {/* Overlay */}
  <div className="absolute inset-0 bg-black opacity-50"></div>
</section>
</main>

      {/* Featured Meals Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-6">Featured Meals</h2>
        {loading ? (
          <p className="text-center">Loading meals...</p>
        ) : (
          <div className="flex w-[100%] overflow-x-auto">
            {featuredMeals.map((meal) => (
              <div key={meal.id} className="bg-white shadow-lg rounded-lg p-4 flex flex-col border border-gray-300 flex-shrink-0 w-[17rem] md:w-[23rem] mr-3 overflow-hidden hover:scale-105 transition cursor-pointer">
                {meal.image_url && (
                  <Image
                    src={`${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/mealbucket/${meal.image_url}`}
                    width={400} height={400}
                    alt={meal.name}
                    className="w-full h-48 object-cover rounded-t-lg mb-2"
                  />
                )}
                <h3 className="text-xl font-bold mb-2">{meal.name}</h3>
                <p className="text-gray-600 mb-2">{meal.description}</p>
                <p className="text-lg font-semibold text-blue-600">Price: ${meal.price}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* About Section */}
      <section className="max-w-6xl mx-auto px-4 py-8 bg-white">
        <h2 className="text-3xl font-bold mb-4">About Us</h2>
        <p>We offer a variety of delicious meals made from fresh ingredients. Our goal is to provide quick and easy access to tasty food options for everyone.</p>
      </section>

      {/* Testimonials Section */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <h2 className="text-3xl font-bold mb-4">What Our Customers Say</h2>
        <blockquote className="border-l-4 border-blue-600 pl-4">
          <p>The best food delivery service I have ever used! Highly recommend{`!"`}</p>
          <footer className="text-gray-600">— Happy Customer</footer>
        </blockquote>
      </section>

      {/* Footer */}
      <footer className="bg-white shadow mt-8">
        <div className="max-w-6xl mx-auto px-4 py-4 flex justify-between">
          <p className="text-gray-600">&copy; {new Date().getFullYear()} Krispy Food Service</p>
          <div>
            <a href="#" className="text-gray-600 hover:text-blue-600">Privacy Policy</a>
            <span className="mx-2">|</span>
            <a href="#" className="text-gray-600 hover:text-blue-600">Terms of Service</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
