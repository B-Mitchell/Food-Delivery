// 'use client'; // Ensure this is a client component
// import React, { useEffect, useState } from 'react';
// import { supabase } from '@/app/supabase'; // Adjust the path as necessary
// import { useUser } from '@clerk/nextjs';

// const VendorDeliveryTrackingPage = () => {
//   const { user } = useUser();
//   const [deliveries, setDeliveries] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   // Fetch deliveries for the logged-in vendor
//   useEffect(() => {
//     const fetchDeliveries = async () => {
//       setLoading(true);
//       try {
//         if (user) {
//           const { data, error } = await supabase
//             .from('deliveries') // Assuming you have a 'deliveries' table
//             .select('*')
//             .eq('vendor_id', user.id); // Fetch deliveries related to the logged-in vendor

//           if (error) throw error;

//           setDeliveries(data);
//         }
//       } catch (error) {
//         console.error('Error fetching deliveries:', error);
//         setError('Failed to load deliveries. Please try again later.');
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchDeliveries();
//   }, [user]);

//   if (loading) {
//     return <p>Loading deliveries...</p>;
//   }

//   if (error) {
//     return <p className="text-red-500">{error}</p>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto px-4 py-8">
//       <h1 className="text-3xl font-bold mb-6">Your Deliveries</h1>
//       {deliveries.length === 0 ? (
//         <p>No deliveries found.</p>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {deliveries.map((delivery) => (
//             <div key={delivery.id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-300">
//               <h3 className="text-xl font-bold mb-2">Delivery ID: {delivery.id}</h3>
//               <p className="text-gray-600 mb-2">Status: {delivery.status}</p>
//               <p className="text-gray-600 mb-2">Meal: {delivery.meal_name}</p>
//               <p className="text-gray-600 mb-2">Buyer: {delivery.buyer_name}</p>
//               <p className="text-gray-600 mb-2">Delivery Address: {delivery.delivery_address}</p>
//               <p className="text-gray-600 mb-2">Estimated Delivery Time: {delivery.estimated_time}</p>
//               {/* You can also add buttons to update the status of the delivery if needed */}
//             </div>
//           ))}
//         </div>
//       )}
//     </div>
//   );
// };

// export default VendorDeliveryTrackingPage;

'use client'; // Ensure this is a client component
import React, { useEffect, useState } from 'react';
import { supabase } from '@/app/supabase'; // Adjust the path as necessary
import { useUser } from '@clerk/nextjs';

const DeliveryTrackingPage = () => {
  const { user } = useUser();
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isVendor, setIsVendor] = useState(false);

  useEffect(() => {
    const checkUserType = async () => {
      if (user) {
        const { data, error } = await supabase
          .from('users') // Assuming you have a 'users' table
          .select('kyc_verified') // Fetch the KYC verification field
          .eq('clerk_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching user type:', error);
          setError('Failed to load user type. Please try again later.');
        } else {
          // Check if the user is a vendor based on KYC verification status
          setIsVendor(data.kyc_verified === true); // Adjust this logic as necessary
        }
      }
    };

    checkUserType();
  }, [user]);

  // Fetch deliveries based on user type
  useEffect(() => {
    const fetchDeliveries = async () => {
      setLoading(true);
      try {
        if (user) {
          const { data, error } = await supabase
            .from('deliveries') // Assuming you have a 'deliveries' table
            .select('*')
            .eq(isVendor ? 'vendor_id' : 'user_id', user.id); // Fetch deliveries related to the user type

          if (error) throw error;

          setDeliveries(data);
        }
      } catch (error) {
        console.error('Error fetching deliveries:', error);
        setError('Failed to load deliveries. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (isVendor !== null) { // Only fetch deliveries after determining user type
      fetchDeliveries();
    }
  }, [user, isVendor]);

  if (loading) {
    return <p>Loading deliveries...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">{isVendor ? 'Your Deliveries' : 'Delivery Tracking'}</h1>
      {deliveries.length === 0 ? (
        <p>No deliveries found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {deliveries.map((delivery) => (
            <div key={delivery.id} className="bg-white shadow-lg rounded-lg p-4 border border-gray-300">
              <h3 className="text-xl font-bold mb-2">Delivery ID: {delivery.id}</h3>
              <p className="text-gray-600 mb-2">Status: {delivery.status}</p>
              <p className="text-gray-600 mb-2">Meal: {delivery.meal_name}</p>
              {isVendor ? (
                <>
                  <p className="text-gray-600 mb-2">Buyer: {delivery.buyer_name}</p>
                  <p className="text-gray-600 mb-2">Delivery Address: {delivery.delivery_address}</p>
                </>
              ) : (
                <p className="text-gray-600 mb-2">Vendor: {delivery.vendor_name}</p>
              )}
              <p className="text-gray-600 mb-2">Estimated Delivery Time: {delivery.estimated_time}</p>
              {/* You can also add buttons to update the status of the delivery if needed */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DeliveryTrackingPage;
