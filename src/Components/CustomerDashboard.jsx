import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShoppingCart, Search, Filter, User, Settings, LogOut, Package, Star, ChevronDown, ChevronUp, Mic } from "lucide-react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ref, onValue } from "firebase/database";
import { db } from "../firebase"; // Ensure this path matches your Firebase config file
import { useNavigate } from "react-router-dom";

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [sortOption, setSortOption] = useState("default");
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [orders, setOrders] = useState([]);
  const [showOrders, setShowOrders] = useState(false);
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const [user] = useState({ name: "Jane Doe", email: "jane@example.com" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchLoading, setSearchLoading] = useState(false);

  // Fetch products from Firebase
  useEffect(() => {
    setLoading(true);
    const productsRef = ref(db, "/");
    onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsArray = Object.keys(data).map((key) => ({
            id: key,
            ...data[key],
            price: data[key].price || "0",
            category: data[key].category || "Uncategorized",
            rating: data[key].rating || 4.0,
            stock: data[key].stock || 10,
            name: data[key].name || "Unnamed Product",
            image: data[key].image || "https://via.placeholder.com/150",
            tamilName: data[key].tamilName || data[key].name,
            images: data[key].images || [data[key].image || "https://via.placeholder.com/150"], // Multiple images
            description: data[key].description || "No description available",
          }));
          setProducts(productsArray);
        } else {
          setProducts([]);
          toast.warn("No products found in the database", { position: "top-right", autoClose: 3000 });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        toast.error("Failed to load products", { position: "top-right", autoClose: 3000 });
        setLoading(false);
      }
    );
  }, []);

  // Voice Recognition
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.warn("Speech recognition is not supported in your browser", { position: "top-right", autoClose: 3000 });
      return;
    }
    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "English" ? "en-US" : "ta-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const product = products.find(
        (p) => p.name.toLowerCase().includes(transcript) || (language === "தமிழ்" && p.tamilName.toLowerCase().includes(transcript))
      );
      if (product) addToCart(product);
      else toast.info(`No product found for "${transcript}"`, { position: "top-right", autoClose: 2000 });
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Speech recognition error", { position: "top-right", autoClose: 2000 });
    };
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.start();
    return () => recognition.stop();
  }, [isListening, language, products]);

  // Add to Cart
  const addToCart = (product) => {
    setCart((prev) => {
      const existingItem = prev.find((item) => item.id === product.id);
      if (existingItem) {
        return prev.map((item) => (item.id === product.id ? { ...item, qty: item.qty + 1 } : item));
      }
      toast.success(`${language === "English" ? product.name : product.tamilName} added to cart!`, { position: "top-right", autoClose: 2000 });
      return [...prev, { ...product, qty: 1 }];
    });
  };

  // Remove from Cart
  const removeFromCart = (id) => {
    setCart((prev) => {
      const item = prev.find((i) => i.id === id);
      toast.error(`${language === "English" ? item.name : item.tamilName} removed from cart`, { position: "top-right", autoClose: 2000 });
      return prev.filter((item) => item.id !== id);
    });
  };

  // Update Quantity
  const updateQuantity = (id, qty) => {
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, qty: Math.max(1, qty) } : item)));
  };

  // Place Order
  const placeOrder = () => {
    if (cart.length === 0) {
      toast.warn(language === "English" ? "Cart is empty!" : "கார்ட் காலியாக உள்ளது!", { position: "top-right", autoClose: 2000 });
      return;
    }
    const newOrder = {
      id: Date.now(),
      items: [...cart],
      total: cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0),
      status: "Processing",
      date: new Date().toLocaleDateString(),
    };
    setOrders((prev) => [...prev, newOrder]);
    setCart([]);
    setShowCart(false);
    toast.success(language === "English" ? "Order placed successfully!" : "ஆர்டர் வெற்றிகரமாக வைக்கப்பட்டது!", { position: "top-right", autoClose: 2000 });
  };

  // Search with Animation
  useEffect(() => {
    if (searchTerm) {
      setSearchLoading(true);
      const timer = setTimeout(() => setSearchLoading(false), 1000); // Simulate network delay
      return () => clearTimeout(timer);
    }
  }, [searchTerm]);

  // Filter and Sort Products
  const filteredProducts = products
    .filter((product) => (filterCategory === "All" ? true : product.category === filterCategory))
    .filter((product) =>
      language === "English"
        ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
        : product.tamilName.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOption === "priceLow") return Number(a.price) - Number(b.price);
      if (sortOption === "priceHigh") return Number(b.price) - Number(a.price);
      if (sortOption === "rating") return b.rating - a.rating;
      return 0;
    });

  // Animation Variants
  const pageVariants = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }, exit: { opacity: 0, y: -20 } };
  const itemVariants = { hidden: { opacity: 0, scale: 0.95 }, visible: { opacity: 1, scale: 1, transition: { duration: 0.3 } } };

  if (loading) return <div className="min-h-screen flex items-center justify-center"><p className="text-teal-800 dark:text-teal-300 text-xl">{language === "English" ? "Loading products..." : "தயாரிப்புகளை ஏற்றுகிறது..."}</p></div>;
  if (error) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600 dark:text-red-400 text-xl">{error}</p></div>;

  return (
    <motion.div className={`min-h-screen p-4 sm:p-6 font-sans ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50 text-gray-800"}`} variants={pageVariants} initial="initial" animate="animate">
      <ToastContainer />

      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 bg-white/90 dark:bg-gray-800/90 backdrop-blur-md p-4 rounded-xl shadow-lg">
        <div className="flex items-center space-x-4 mb-4 sm:mb-0">
          <motion.img src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg" alt="Logo" className="w-12 h-12 rounded-full border-2 border-teal-300 dark:border-teal-500" whileHover={{ scale: 1.1, rotate: 360 }} transition={{ duration: 0.5 }} />
          <h1 className="text-xl sm:text-2xl font-bold text-teal-700 dark:text-teal-300">{language === "English" ? "Customer Dashboard" : "வாடிக்கையாளர் டாஷ்போர்டு"}</h1>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          <motion.button onClick={() => setShowCart(!showCart)} className="relative p-2 bg-teal-100 dark:bg-teal-700 rounded-full hover:bg-teal-200 dark:hover:bg-teal-600" whileHover={{ scale: 1.1 }}>
            <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700 dark:text-teal-200" />
            {cart.length > 0 && <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{cart.length}</span>}
          </motion.button>
          <motion.button onClick={() => setShowOrders(!showOrders)} className="p-2 bg-teal-100 dark:bg-teal-700 rounded-full hover:bg-teal-200 dark:hover:bg-teal-600" whileHover={{ scale: 1.1 }}>
            <Package className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700 dark:text-teal-200" />
          </motion.button>
          <motion.button onClick={() => setShowSettings(!showSettings)} className="p-2 bg-teal-100 dark:bg-teal-700 rounded-full hover:bg-teal-200 dark:hover:bg-teal-600" whileHover={{ scale: 1.1 }}>
            <Settings className="w-5 h-5 sm:w-6 sm:h-6 text-teal-700 dark:text-teal-200" />
          </motion.button>
          <motion.button className="p-2 bg-red-100 dark:bg-red-700 rounded-full hover:bg-red-200 dark:hover:bg-red-600" whileHover={{ scale: 1.1 }}>
            <LogOut className="w-5 h-5 sm:w-6 sm:h-6 text-red-700 dark:text-red-200" />
          </motion.button>
        </div>
      </header>

      {/* Settings Dropdown */}
      <AnimatePresence>
        {showSettings && (
          <motion.div className="absolute top-20 right-4 sm:right-6 z-10 p-4 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-teal-200 dark:border-teal-600" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }}>
            <div className="space-y-4">
              <div>
                <p className="font-semibold text-teal-700 dark:text-teal-300">{user.name}</p>
                <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
              </div>
              <select value={language} onChange={(e) => setLanguage(e.target.value)} className="w-full p-2 rounded-lg border border-teal-200 dark:border-teal-600 bg-white dark:bg-gray-700">
                <option value="English">English</option>
                <option value="தமிழ்">தமிழ்</option>
              </select>
              <button onClick={() => setDarkMode(!darkMode)} className="w-full p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400">{darkMode ? "Light Mode" : "Dark Mode"}</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto">
        {/* Search, Filter, Sort, and Voice */}
        <div className="flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <div className="relative flex-1 w-full">
            <input
              type="text"
              placeholder={language === "English" ? "Search products..." : "தயாரிப்புகளைத் தேடு..."}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full p-3 pl-10 rounded-lg border border-teal-200 dark:border-teal-600 bg-white/90 dark:bg-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-teal-500 dark:text-teal-300" />
          </div>
          <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="w-full sm:w-auto p-3 rounded-lg border border-teal-200 dark:border-teal-600 bg-white/90 dark:bg-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 focus:outline-none">
            <option value="All">{language === "English" ? "All Categories" : "அனைத்து பிரிவுகள்"}</option>
            <option value="Vegetables">{language === "English" ? "Vegetables" : "காய்கறிகள்"}</option>
            <option value="Fruits">{language === "English" ? "Fruits" : "பழங்கள்"}</option>
            <option value="Nuts & Seeds">{language === "English" ? "Nuts & Seeds" : "நட்ஸ் & விதைகள்"}</option>
            <option value="Oils">{language === "English" ? "Oils" : "எண்ணெய்கள்"}</option>
            <option value="Dairy Products">{language === "English" ? "Dairy Products" : "பால் பொருட்கள்"}</option>
          </select>
          <select value={sortOption} onChange={(e) => setSortOption(e.target.value)} className="w-full sm:w-auto p-3 rounded-lg border border-teal-200 dark:border-teal-600 bg-white/90 dark:bg-gray-700 focus:ring-2 focus:ring-teal-400 dark:focus:ring-teal-500 focus:outline-none">
            <option value="default">{language === "English" ? "Sort By" : "வரிசைப்படுத்து"}</option>
            <option value="priceLow">{language === "English" ? "Price: Low to High" : "விலை: குறைவு முதல் அதிகம்"}</option>
            <option value="priceHigh">{language === "English" ? "Price: High to Low" : "விலை: அதிகம் முதல் குறைவு"}</option>
            <option value="rating">{language === "English" ? "Rating" : "மதிப்பீடு"}</option>
          </select>
          <motion.button onClick={() => setIsListening(!isListening)} className={`p-3 rounded-full ${isListening ? "bg-red-500" : "bg-teal-500"} text-white`} whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
            <Mic className="w-5 h-5 sm:w-6 sm:h-6" />
          </motion.button>
        </div>

        {/* Search Loading Animation */}
        {searchLoading && (
          <div className="flex justify-center mb-6">
            <motion.div className="w-10 h-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" initial={{ rotate: 0 }} animate={{ rotate: 360 }} transition={{ duration: 1, repeat: Infinity }} />
          </div>
        )}

        {/* Product Grid */}
        <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6" layout>
          <AnimatePresence>
            {filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className={`p-4 bg-white dark:bg-gray-800 rounded-xl shadow-md transition-all cursor-pointer border border-teal-100 dark:border-teal-700 ${darkMode ? "hover:backdrop-blur-md hover:shadow-[0_0_15px_rgba(0,255,255,0.3)]" : "hover:shadow-xl"}`}
                whileHover={{ scale: 1.05 }}
                onClick={() => navigate(`/product/${product.id}`, { state: { product } })}
              >
                <img src={product.image} alt={product.name} className="w-full h-40 sm:h-48 object-cover rounded-lg mb-3" />
                <h3 className="text-lg font-semibold text-teal-700 dark:text-teal-300">{language === "English" ? product.name : product.tamilName}</h3>
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="text-sm text-gray-600 dark:text-gray-300">{product.rating}</span>
                </div>
                <p className="text-teal-600 dark:text-teal-400 font-medium">₹{product.price}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">{language === "English" ? "Stock" : "இருப்பு"}: {product.stock}</p>
                <motion.button onClick={(e) => { e.stopPropagation(); addToCart(product); }} className="mt-3 w-full p-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-500" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} disabled={product.stock === 0}>
                  {product.stock > 0 ? (language === "English" ? "Add to Cart" : "கார்ட்டில் சேர்") : (language === "English" ? "Out of Stock" : "இருப்பு இல்லை")}
                </motion.button>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Cart Sidebar */}
        <AnimatePresence>
          {showCart && (
            <motion.div className="fixed top-0 right-0 h-full w-72 sm:w-80 bg-white dark:bg-gray-800 shadow-2xl p-4 sm:p-6 z-20 overflow-y-auto" initial={{ x: 300 }} animate={{ x: 0 }} exit={{ x: 300 }} transition={{ duration: 0.4 }}>
              <h2 className="text-xl font-bold text-teal-700 dark:text-teal-300 mb-4">{language === "English" ? "Your Cart" : "உங்கள் கார்ட்"}</h2>
              {cart.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">{language === "English" ? "Cart is empty" : "கார்ட் காலியாக உள்ளது"}</p>
              ) : (
                <>
                  {cart.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 mb-4">
                      <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                      <div className="flex-1">
                        <p className="font-medium text-teal-700 dark:text-teal-300">{language === "English" ? item.name : item.tamilName}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">₹{Number(item.price)}</p>
                        <input type="number" value={item.qty} onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))} className="w-16 p-1 mt-1 rounded border border-teal-200 dark:border-teal-600 bg-white dark:bg-gray-700" min="1" />
                      </div>
                      <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800">✕</button>
                    </div>
                  ))}
                  <p className="text-lg font-bold text-teal-700 dark:text-teal-300">{language === "English" ? "Total" : "மொத்தம்"}: ₹{cart.reduce((sum, item) => sum + Number(item.price) * item.qty, 0)}</p>
                  <motion.button onClick={placeOrder} className="mt-4 w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 dark:bg-teal-500 dark:hover:bg-teal-400" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    {language === "English" ? "Place Order" : "ஆர்டர் வை"}
                  </motion.button>
                </>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Order Tracking */}
        <AnimatePresence>
          {showOrders && (
            <motion.div className="mt-6 p-4 sm:p-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
              <h2 className="text-xl sm:text-2xl font-bold text-teal-700 dark:text-teal-300 mb-4">{language === "English" ? "Your Orders" : "உங்கள் ஆர்டர்கள்"}</h2>
              {orders.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">{language === "English" ? "No orders yet" : "இன்னும் ஆர்டர்கள் இல்லை"}</p>
              ) : (
                orders.map((order) => (
                  <div key={order.id} className="border-b border-teal-100 dark:border-teal-700 py-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold text-teal-700 dark:text-teal-300">{language === "English" ? "Order #" : "ஆர்டர் #"}{order.id}</p>
                        <p className="text-sm text-gray-600 dark:text-gray-300">{order.date}</p>
                      </div>
                      <p className="text-teal-600 dark:text-teal-400 font-medium">₹{order.total}</p>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">{language === "English" ? "Status" : "நிலை"}: {order.status}</p>
                    <details className="mt-2">
                      <summary className="cursor-pointer text-teal-700 dark:text-teal-300 flex items-center space-x-2">
                        <span>{language === "English" ? "Items" : "பொருட்கள்"}</span>
                        <ChevronDown className="w-4 h-4" />
                      </summary>
                      <ul className="ml-4 mt-2 text-gray-600 dark:text-gray-300">
                        {order.items.map((item) => (
                          <li key={item.id}>{language === "English" ? item.name : item.tamilName} - {item.qty} x ₹{item.price}</li>
                        ))}
                      </ul>
                    </details>
                  </div>
                ))
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

// Product Details Page Component
const ProductDetails = () => {
  const { state } = useLocation();
  const { product } = state || {};
  const [selectedImage, setSelectedImage] = useState(product?.images[0]);
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([{ user: "John", comment: "Great product!", rating: 5 }]);
  const [zoom, setZoom] = useState(false);

  if (!product) return <div className="min-h-screen flex items-center justify-center"><p className="text-red-600">Product not found</p></div>;

  const addToCart = () => {
    // Add to cart logic here (you can pass it back to the parent component or use context)
    toast.success(`${product.name} added to cart!`, { position: "top-right", autoClose: 2000 });
  };

  const buyNow = () => {
    toast.success(`Proceeding to buy ${product.name}!`, { position: "top-right", autoClose: 2000 });
    // Add buy now logic here
  };

  const submitFeedback = () => {
    if (feedback.trim()) {
      setFeedbacks((prev) => [...prev, { user: "Jane", comment: feedback, rating: 4 }]);
      setFeedback("");
      toast.success("Feedback submitted!", { position: "top-right", autoClose: 2000 });
    }
  };

  return (
    <motion.div className="min-h-screen p-4 sm:p-6 bg-gradient-to-br from-teal-50 via-cyan-50 to-emerald-50" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-lg p-4 sm:p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-teal-700 mb-4">{product.name}</h1>
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <motion.img
              src={selectedImage}
              alt={product.name}
              className="w-full h-64 sm:h-96 object-cover rounded-lg mb-4 cursor-pointer"
              whileHover={{ scale: zoom ? 1.5 : 1 }}
              onMouseEnter={() => setZoom(true)}
              onMouseLeave={() => setZoom(false)}
            />
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((img, idx) => (
                <img key={idx} src={img} alt={`${product.name}-${idx}`} className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80" onClick={() => setSelectedImage(img)} />
              ))}
            </div>
          </div>
          <div className="flex-1">
            <p className="text-gray-600 mb-4">{product.description}</p>
            <p className="text-teal-600 font-bold text-xl mb-4">₹{product.price}</p>
            <div className="flex items-center mb-4">
              <Star className="w-5 h-5 text-yellow-400" />
              <span className="ml-1 text-gray-600">{product.rating}</span>
            </div>
            <p className="text-gray-600 mb-4">{language === "English" ? "Stock" : "இருப்பு"}: {product.stock}</p>
            <div className="flex space-x-4">
              <button onClick={addToCart} className="flex-1 p-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600" disabled={product.stock === 0}>{language === "English" ? "Add to Cart" : "கார்ட்டில் சேர்"}</button>
              <button onClick={buyNow} className="flex-1 p-3 bg-green-500 text-white rounded-lg hover:bg-green-600">{language === "English" ? "Buy Now" : "இப்போது வாங்கு"}</button>
            </div>
          </div>
        </div>
        <div className="mt-8">
          <h2 className="text-xl font-bold text-teal-700 mb-4">{language === "English" ? "Customer Feedback" : "வாடிக்கையாளர் கருத்து"}</h2>
          <textarea value={feedback} onChange={(e) => setFeedback(e.target.value)} placeholder={language === "English" ? "Leave your feedback..." : "உங்கள் கருத்தை விடுங்கள்..."} className="w-full p-3 rounded-lg border border-teal-200 mb-4" rows="4" />
          <button onClick={submitFeedback} className="w-full sm:w-auto p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700">{language === "English" ? "Submit Feedback" : "கருத்தை சமர்ப்பி"}</button>
          <div className="mt-4">
            {feedbacks.map((fb, idx) => (
              <div key={idx} className="border-b border-teal-100 py-2">
                <p className="font-semibold text-teal-700">{fb.user}</p>
                <p className="text-gray-600">{fb.comment}</p>
                <div className="flex items-center">
                  <Star className="w-4 h-4 text-yellow-400" />
                  <span className="ml-1 text-gray-600">{fb.rating}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default CustomerDashboard;