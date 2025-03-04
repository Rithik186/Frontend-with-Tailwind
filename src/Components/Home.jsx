import React, { useState } from 'react';

const Home = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="relative min-h-screen w-full bg-orange-50">
      {/* Main content area with orange gradient background */}
      <div className="min-h-screen bg-gradient-to-br from-orange-600 to-orange-400 text-white">
        
        {/* Navigation bar */}
        <header className="flex justify-between items-center p-6 lg:px-10 relative z-10">
          {/* Logo */}
          <div className="flex items-center">
            <svg width="60" height="36" viewBox="0 0 60 36" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 0H12V12H0V0Z" fill="#FF5722"/>
              <path d="M18 0H30V12H18V0Z" fill="#FF5722"/>
              <path d="M9 18H21V30H9V18Z" fill="#FF5722"/>
              <circle cx="49" cy="9" r="4" fill="#FF5722"/>
            </svg>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-10">
            <a href="#" className="text-white font-medium">Home</a>
            <a href="#" className="text-white font-medium">Services</a>
            <a href="#" className="text-white font-medium">Portfolios</a>
            <a href="#" className="text-white font-medium">Contact</a>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="text-white p-2 rounded-md lg:hidden" 
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <div className="bg-orange-200 text-orange-600 px-5 py-2 rounded-full font-bold">
              MENU
            </div>
          </button>
        </header>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="lg:hidden absolute top-0 right-0 h-screen w-64 bg-orange-700 p-6 z-20">
            <div className="flex justify-end">
              <button onClick={() => setMenuOpen(false)}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </button>
            </div>
            <div className="flex flex-col space-y-6 mt-10">
              <a href="#" className="text-white font-medium">Home</a>
              <a href="#" className="text-white font-medium">Services</a>
              <a href="#" className="text-white font-medium">Portfolios</a>
              <a href="#" className="text-white font-medium">Contact</a>
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex flex-col lg:flex-row min-h-[calc(100vh-72px)]">
          {/* Left side content */}
          <div className="flex-1 p-6 lg:p-12">
            {/* Window with mountain view */}
            <div className="relative h-96 lg:h-full max-h-[500px] mb-8 lg:mb-0">
              <div className="absolute inset-0 grid grid-cols-5 grid-rows-5 border-8 border-orange-300/50">
                {[...Array(25)].map((_, i) => (
                  <div key={i} className="border border-orange-300/50"></div>
                ))}
              </div>
              <div className="absolute inset-0 bg-gradient-to-b from-orange-300/20 to-orange-500/20">
                <div className="absolute bottom-0 w-full h-1/3 bg-gradient-to-t from-orange-700/50 to-transparent"></div>
                <div className="absolute bottom-10 left-0 w-full h-20 bg-orange-900/30 blur-md rounded-full transform scale-x-150"></div>
              </div>
            </div>

            {/* Branding text */}
            <div className="mt-6 lg:mt-12">
              <div className="text-orange-200/80 text-sm mb-1">WE ARE WLT DESIGN</div>
              <h1 className="text-5xl lg:text-7xl font-bold leading-tight mb-4">
                Elevate Your<br />
                Digital Presence
              </h1>
            </div>
          </div>

          {/* Right side content */}
          <div className="flex-1 p-6 lg:p-12 flex flex-col justify-center relative">
            <div className="text-center lg:text-left mb-8">
              <div className="text-lg text-orange-200 mb-2">Hello</div>
              <div className="text-3xl font-bold mb-6">World!</div>
              
              <div className="flex flex-col items-center lg:items-start mb-12">
                <div className="h-16 w-8 bg-orange-200/80 rounded-md mb-4"></div>
                <h2 className="text-2xl font-medium">
                  A Glimpse Into<br />
                  Who We Are
                </h2>
              </div>
            </div>

            {/* Living room setting */}
            <div className="relative">
              {/* Couch */}
              <div className="h-20 w-64 bg-yellow-400 rounded-md mb-4 mx-auto lg:mx-0"></div>
              
              {/* Coffee table */}
              <div className="h-12 w-40 bg-orange-800 rounded-sm mx-auto lg:mx-12"></div>
              
              {/* Desk setup */}
              <div className="absolute right-4 lg:right-24 top-6 flex flex-col">
                <div className="h-16 w-32 bg-white rounded-lg"></div>
                <div className="h-8 w-20 bg-orange-600 mt-2 rounded-sm mx-auto"></div>
              </div>
              
              {/* Potted plant */}
              <div className="absolute right-4 bottom-0">
                <div className="h-8 w-8 bg-green-800 rounded-sm"></div>
                <div className="h-4 w-10 bg-orange-300 mt-1 rounded-sm"></div>
              </div>
            </div>

            {/* Bottom text */}
            <div className="mt-12 text-right">
              <p className="text-lg mb-1">We make great digital experiences.</p>
              <p className="text-sm">Scroll to find out how we do it.</p>
            </div>
          </div>
        </div>

        {/* Circular lights at top */}
        <div className="absolute top-20 right-0 left-0 flex justify-center space-x-8 pointer-events-none">
          <div className="h-32 w-32 border-4 border-orange-200 rounded-full opacity-70"></div>
          <div className="h-40 w-40 border-4 border-orange-200 rounded-full opacity-70 mt-8"></div>
          <div className="h-48 w-48 border-4 border-orange-200 rounded-full opacity-70"></div>
        </div>

        {/* Floor */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-orange-700/50 to-transparent"></div>
      </div>
    </div>
  );
};

export default Home;