'use client';
import { useState } from 'react';
import { SignedIn, SignInButton, SignedOut, UserButton, useUser } from '@clerk/nextjs'; // Clerk for authentication
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const { user, isSignedIn } = useUser();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter(); // Initialize router

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Navigation helper
  const navigate = (path) => {
    router.push(path);
    toggleMenu();
  };

  return (
    <nav className="bg-blue-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0 cursor-pointer" onClick={() => navigate('/')}>
            <span className="text-2xl font-bold">Krispy Food Service</span>
          </div>

          {/* Menu for larger screens */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button onClick={() => navigate('/')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Home
              </button>
              <button onClick={() => navigate('/profile')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Profile
              </button>
              <button onClick={() => navigate('/meals')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Meals
              </button>
              <button onClick={() => navigate('/contact')} className="hover:bg-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                Contact
              </button>

              {/* Signed In View */}
              <SignedIn>
                <UserButton /> {/* Clerk's UserButton handles profile and logout */}
              </SignedIn>

              {/* Signed Out View */}
              <SignedOut>
                <SignInButton mode="modal" className="hover:bg-gray-200 px-3 py-2 rounded-md font-medium text-white" /> {/* Modal login */}
              </SignedOut>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={toggleMenu}
              className="bg-blue-900 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-700 focus:outline-none"
            >
              <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isOpen ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden text-center">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 text-center">
            <button onClick={() => navigate('/')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-[100%]">
              Home
            </button>
            <button onClick={() => navigate('/profile')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-[100%]">
              Profile
            </button>
            <button onClick={() => navigate('/meals')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-[100%]">
              Meals
            </button>
            <button onClick={() => navigate('/contact')} className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-[100%]">
              Contact
            </button>
            {/* Signed In View */}
            <SignedIn className="hover:bg-blue-700 block text-left px-3 py-2 rounded-md text-base font-medium w-[100%]">
                <UserButton /> {/* Clerk's UserButton handles profile and logout */}
              </SignedIn>

              {/* Signed Out View */}
              <SignedOut>
                <SignInButton mode="modal" className="hover:bg-blue-700 block px-3 py-2 rounded-md text-base font-medium w-[100%]" /> {/* Modal login */}
              </SignedOut>
          </div>
        </div>
      )}
    </nav>
  );
}
