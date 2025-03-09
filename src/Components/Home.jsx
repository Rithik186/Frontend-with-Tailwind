import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';

const Home = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const headerVariants = {
    hidden: { y: -100, opacity: 0 },
    visible: { 
      y: 0,
      opacity: 1,
      transition: { 
        type: 'spring',
        stiffness: 100,
        damping: 20
      }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        duration: 0.6,
        ease: 'easeOut'
      }
    }
  };

  const navItems = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Services', href: '#services' },
    { name: 'Farmers', href: '#farmers' },
    { name: 'Contact', href: '#contact' },
  ];

  const handleNavClick = (e, href) => {
    e.preventDefault();
    setIsMenuOpen(false);
    const section = document.querySelector(href);
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 antialiased font-sans">
      {/* Header - Reduced height */}
      <motion.header 
        className="fixed top-0 w-full z-50 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100 h-12"
        initial="hidden"
        animate="visible"
        variants={headerVariants}
      >
        <nav className="container mx-auto px-4 sm:px-6 lg:px-8 py-2 flex items-center justify-between">
          <a href="#home" onClick={(e) => handleNavClick(e, '#home')} className="flex items-center gap-1">
            <span className="text-yellow-500 text-lg sm:text-xl">🌾</span>
            <span className="text-lg sm:text-xl font-bold text-gray-800 whitespace-nowrap">Farm2Consumer</span>
          </a>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8 mr-10">
            {navItems.map((item) => (
              <a 
                key={item.name}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="text-sm text-gray-600 hover:text-emerald-600 transition-colors font-medium"
              >
                {item.name}
              </a>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="lg:hidden text-gray-600 hover:text-emerald-600 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} 
              />
            </svg>
          </button>

          {/* Mobile Navigation */}
          <div 
            className={`${
              isMenuOpen ? 'block' : 'hidden'
            } lg:hidden absolute top-full left-0 right-0 bg-white shadow-md p-3 mt-1`}
          >
            <div className="flex flex-col space-y-1">
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="py-1 px-3 text-gray-600 hover:text-emerald-600 hover:bg-gray-100 rounded-md transition-colors font-medium text-sm"
                >
                  {item.name}
                </a>
              ))}
            </div>
          </div>
        </nav>
      </motion.header>

      {/* Hero Section with Background Image */}
      <section 
        id="home" 
        className="pt-20 bg-gradient-to-r to-black  sm:pt-24 pb-12 sm:pb-20 px-4 sm:px-6 lg:px-8 flex items-center justify-center min-h-[75vh] bg-cover bg-center"
        style={{ backgroundImage: `url(https://static.vecteezy.com/system/resources/thumbnails/015/643/193/small/abstract-modern-white-and-grey-gradient-geometric-pattern-background-vector.jpg)` }}
      >
        <div className="text-center max-w-4xl">
          <motion.h1 
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 text-gray-800 tracking-tight"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Fresh from Farm to Table
          </motion.h1>
          <motion.p 
            className="text-base sm:text-lg md:text-xl text-gray-600 mb-8 sm:mb-10 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            Connecting farmers and consumers through blockchain-powered transparency
          </motion.p>
          <Link to="/get">
            <motion.button 
              className="bg-emerald-600 text-white px-6 sm:px-8 py-2 sm:py-3 rounded-full font-medium hover:bg-emerald-700 transition-all shadow-lg text-sm sm:text-base"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section id="services" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-800">Our Services</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              { icon: '🌿', title: 'Organic Farming', desc: 'Pure, pesticide-free produce' },
              { icon: '🚜', title: 'Direct Sourcing', desc: 'From farm to your table' },
              { icon: '🔒', title: 'Blockchain Tracking', desc: 'Transparent supply chain' },
              { icon: '🛒', title: 'Easy Ordering', desc: 'Shop with convenience' },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                className="bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 text-center"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
              >
                <div className="text-4xl sm:text-5xl mb-4 text-emerald-600 mx-auto">{feature.icon}</div>
                <h3 className="text-lg sm:text-xl font-semibold mb-2 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600 text-sm sm:text-base">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 items-center max-w-6xl">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-2 md:order-1"
          >
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-6 text-gray-800">About Us</h2>
            <p className="text-gray-600 mb-6 sm:mb-8 text-sm sm:text-base">
              We connect farmers directly with consumers using blockchain technology for trust and transparency. Our mission is to support local agriculture and deliver fresh, quality produce to your doorstep.
            </p>
            <button className="bg-emerald-600 text-white px-4 sm:px-6 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-sm text-sm sm:text-base">
              Learn More
            </button>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="order-1 md:order-2"
          >
            <img 
              src="https://media.istockphoto.com/id/543212762/photo/tractor-cultivating-field-at-spring.jpg?s=612x612&w=0&k=20&c=uJDy7MECNZeHDKfUrLNeQuT7A1IqQe89lmLREhjIJYU=" 
              alt="Farm" 
              className="w-full h-64 sm:h-80 object-cover rounded-xl shadow-md"
            />
          </motion.div>
        </div>
      </section>

      {/* Farmers Section */}
      <section id="farmers" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-800">Our Technology</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 max-w-6xl mx-auto">
            {[
              { name: 'Blockchain', img: 'data:image/jpeg;base64,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' },
              { name: 'F2C', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTopU_LDClItBwaUawWxNmjGdHlT17Giau3Xg&s' },
              { name: 'S2C', img: 'https://knowsdgs.jrc.ec.europa.eu/themes/sdgs/assets/img/targets/GOAL_2_TARGETS_PNG/GOAL_2_TARGET_2.4.png' },
              { name: 'Buy & Sell', img: 'https://png.pngtree.com/png-vector/20230513/ourmid/pngtree-buy-and-sell-button-with-red-green-color-vector-png-image_7097137.png' },
            ].map((farmer, index) => (
              <motion.div
                key={farmer.name}
                className="text-center bg-gray-50 p-4 sm:p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
              >
                <img 
                  src={farmer.img} 
                  alt={farmer.name} 
                  className="w-20 sm:w-24 h-20 sm:h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-base sm:text-lg font-semibold text-gray-800">{farmer.name}</h3>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Farm Spotlight */}
      <section id="farm-spotlight" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-800">Farm Spotlight</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Green Acres', img: 'https://i0.wp.com/picjumbo.com/wp-content/uploads/green-fields-free-image.jpg?w=2210&quality=70', story: 'A family-run farm growing organic veggies since 1995.' },
              { name: 'Sunny Fields', img: 'https://media.istockphoto.com/id/815712236/photo/golden-wheat-field-under-beautiful-sunset-sky.jpg?s=612x612&w=0&k=20&c=Dy9vp9z8_G8HqAEl1vYJ8mDSH5qxL1T4PwbiIx7Ts54=', story: 'Sustainable farming with a passion for quality.' },
              { name: 'Harvest Haven', img: 'https://img.vistarooms.com/gallery/compressed/harvest-haven-c5b9af.jpg', story: 'Delivering fresh produce straight to you.' },
            ].map((farm, index) => (
              <motion.div
                key={farm.name}
                className="bg-white rounded-xl shadow-md overflow-hidden"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
              >
                <img src={farm.img} alt={farm.name} className="w-full h-48 object-cover" />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{farm.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{farm.story}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Farmer’s Daily Pick */}
      <section id="daily-pick" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-800">Farmer’s Daily Pick</h2>
          <motion.div
            className="bg-white rounded-xl shadow-md overflow-hidden"
            variants={cardVariants}
            initial="hidden"
            whileInView="visible"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
              <img 
                src="https://media.istockphoto.com/id/1346744481/photo/anonymous-chef-harvesting-fresh-vegetables-on-a-farm.jpg?s=612x612&w=0&k=20&c=U9h4fAi68nwVndAJW8TF-f2lFFCO2Y-XrZWA2gah1Xw=" 
                alt="Daily Pick" 
                className="w-full h-64 sm:h-80 object-cover" 
              />
              <div className="p-4 sm:p-6 flex flex-col justify-center text-center md:text-left">
                <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-gray-800">Golden Beets</h3>
                <p className="text-gray-600 text-sm sm:text-base mt-2">Picked fresh by Farmer Rajesh this morning—sweet, earthy, and perfect for roasting!</p>
                <p className="text-gray-400 text-xs sm:text-sm mt-2">Available Today Only</p>
                <button className="mt-4 bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-md text-sm sm:text-base">
                  Grab Yours Now
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Meet Your Farmers */}
      <section id="meet-farmers" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-12 sm:mb-16 text-gray-800">Meet Your Farmers</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
            {[
              { 
                name: 'Priya Sharma', 
                img: 'https://images.pexels.com/photos/235725/pexels-photo-235725.jpeg', 
                bio: 'Growing organic greens for 10 years.', 
                message: 'Love feeding families like yours!' 
              },
              { 
                name: 'John Mendes', 
                img: 'https://c0.wallpaperflare.com/preview/462/721/223/new-hampshire-new-england-america-farm.jpg', 
                bio: 'Specializing in heirloom tomatoes.', 
                message: 'Freshness is my promise!' 
              },
              { 
                name: 'Aisha Khan', 
                img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c', 
                bio: 'Passionate about sustainable farming.', 
                message: 'From my farm to your plate!' 
              },
            ].map((farmer, index) => (
              <motion.div
                key={farmer.name}
                className="bg-gray-50 rounded-xl shadow-md overflow-hidden text-center"
                custom={index}
                variants={cardVariants}
                initial="hidden"
                whileInView="visible"
              >
                <img src={farmer.img} alt={farmer.name} className="w-full h-48 object-cover" />
                <div className="p-4 sm:p-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-800">{farmer.name}</h3>
                  <p className="text-gray-600 text-sm sm:text-base">{farmer.bio}</p>
                  <p className="text-emerald-600 text-sm sm:text-base mt-2 italic">"{farmer.message}"</p>
                </div>
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-8">
            <button className="bg-emerald-600 text-white px-6 py-2 rounded-full hover:bg-emerald-700 transition-all shadow-md text-sm sm:text-base">
              Meet More Farmers
            </button>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-12 sm:py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="container mx-auto max-w-lg text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-10 sm:mb-12 text-gray-800">Contact Us</h2>
          <motion.form
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
            onSubmit={(e) => e.preventDefault()}
          >
            <input 
              type="text" 
              placeholder="Your Name" 
              className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 text-sm sm:text-base"
              required
            />
            <input 
              type="email" 
              placeholder="Your Email" 
              className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 text-sm sm:text-base"
              required
            />
            <textarea 
              placeholder="Your Message" 
              rows="5" 
              className="w-full p-3 sm:p-4 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 transition-all text-gray-800 text-sm sm:text-base"
              required
            ></textarea>
            <button 
              type="submit" 
              className="w-full bg-emerald-600 text-white p-3 sm:p-4 rounded-lg hover:bg-emerald-700 transition-all shadow-md text-sm sm:text-base"
            >
              Send Message
            </button>
          </motion.form>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 sm:py-12 px-4 sm:px-6 lg:px-8 bg-gray-800 text-gray-300">
        <div className="container mx-auto text-center">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 sm:gap-8 mb-6 sm:mb-8 max-w-6xl mx-auto">
            <div>
              <h4 className="text-lg sm:text-xl font-bold mb-4 flex items-center justify-center gap-2">
                <span className="text-emerald-500 text-xl sm:text-2xl">🌾</span> 
                <span>Farm2Consumer</span>
              </h4>
              <p className="text-gray-400 text-sm sm:text-base">Connecting farms to homes</p>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Links</h4>
              {navItems.map((item) => (
                <a 
                  key={item.name}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className="block text-gray-400 hover:text-white transition-colors py-1 text-sm sm:text-base"
                >
                  {item.name}
                </a>
              ))}
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Contact</h4>
              <p className="text-gray-400 text-sm sm:text-base">support@farm2consumer.com</p>
              <p className="text-gray-400 text-sm sm:text-base">+1 234 567 890</p>
            </div>
            <div>
              <h4 className="text-base sm:text-lg font-semibold mb-4">Newsletter</h4>
              <div className="flex justify-center">
                <input 
                  type="email" 
                  placeholder="Your email" 
                  className="p-2 rounded-l-lg bg-gray-700 text-gray-300 border border-gray-600 focus:outline-none text-sm sm:text-base w-full sm:w-auto"
                />
                <button className="p-2 bg-emerald-600 rounded-r-lg hover:bg-emerald-700 transition-all text-sm sm:text-base">
                  Subscribe
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-center space-x-6 mb-4">
            {['Facebook', 'Twitter', 'Instagram'].map((social) => (
              <a 
                key={social}
                href="#" 
                className="text-lg sm:text-xl text-gray-400 hover:text-emerald-500 transition-all"
              >
                {social === 'Facebook' ? '📘' : social === 'Twitter' ? '🐦' : '📸'}
              </a>
            ))}
          </div>
          <p className="text-gray-400 text-sm sm:text-base">© 2025 Farmer To Consumer. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;