import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, User, Settings, LogOut, ShoppingCart } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, onValue } from 'firebase/database';
import { db } from '../firebase'; // Adjusted path to src/firebase.js

const ProductSelection = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [billList, setBillList] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [disputes, setDisputes] = useState([]);
  const [newDispute, setNewDispute] = useState("");
  const [language, setLanguage] = useState("English");
  const [isListening, setIsListening] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [farmerInfo] = useState({ name: "John Doe", email: "john@example.com" });
  const [cartCount, setCartCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from Realtime Database
  useEffect(() => {
    setLoading(true);
    const productsRef = ref(db, '/');
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
          }));
          setProducts(productsArray);
        } else {
          setProducts([]);
          toast.warn("No products found in the database", {
            position: "top-right",
            autoClose: 3000,
          });
        }
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching products:", error);
        setError("Failed to load products. Please try again later.");
        toast.error("Failed to load products", {
          position: "top-right",
          autoClose: 3000,
        });
        setLoading(false);
      }
    );
  }, []);

  // Voice Recognition Setup
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.warn("Speech recognition is not supported in your browser", {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "English" ? "en-US" : "ta-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const product = products.find(
        (p) =>
          p.name.toLowerCase().includes(transcript) ||
          (language === "தமிழ்" && p.tamilName.toLowerCase().includes(transcript))
      );
      if (product) {
        toggleSelection(product);
      } else {
        toast.info(`No product found for "${transcript}"`, {
          position: "top-right",
          autoClose: 2000,
        });
      }
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      toast.error("Speech recognition error", {
        position: "top-right",
        autoClose: 2000,
      });
    };
    recognition.onend = () => setIsListening(false);

    if (isListening) recognition.start();
    return () => recognition.stop();
  }, [isListening, language, products]);

  // Product Selection Logic with Toast
  const toggleSelection = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        toast.error(`${product.name} removed from cart`, {
          position: "top-right",
          autoClose: 2000,
        });
        setCartCount((prev) => prev - 1);
        return prev.filter((p) => p.id !== product.id);
      } else {
        toast.success(`${product.name} added to cart`, {
          position: "top-right",
          autoClose: 2000,
        });
        setCartCount((prev) => prev + 1);
        return [...prev, product];
      }
    });
  };

  const addToBill = () => {
    setBillList((prev) => {
      let updatedBill = [...prev];
      selectedProducts.forEach((product) => {
        const existingIndex = updatedBill.findIndex((item) => item.id === product.id);
        if (existingIndex !== -1) {
          updatedBill[existingIndex].qty += 1;
          updatedBill[existingIndex].finalPrice =
            updatedBill[existingIndex].qty * Number(product.price);
        } else {
          updatedBill.push({
            ...product,
            qty: 1,
            finalPrice: Number(product.price),
          });
        }
      });
      return updatedBill;
    });
    setSelectedProducts([]);
    setCartCount(0);
  };

  const updateQuantity = (id, newQty) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              qty: Math.max(1, newQty),
              finalPrice: Math.max(1, newQty) * Number(item.price),
            }
          : item
      )
    );
  };

  const removeItem = (id) => {
    setBillList((prev) => prev.filter((item) => item.id !== id));
  };

  const addDispute = () => {
    if (newDispute.trim()) {
      setDisputes((prev) => [...prev, newDispute]);
      setNewDispute("");
      toast.success("Dispute submitted", {
        position: "top-right",
        autoClose: 2000,
      });
    } else {
      toast.warn("Please enter a dispute before submitting", {
        position: "top-right",
        autoClose: 2000,
      });
    }
  };

  const filteredProducts = products.filter((product) =>
    language === "English"
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : product.tamilName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedBill = {
    Vegetables: billList.filter(
      (item) =>
        item.category === "Vegetables" ||
        ["Cabbage", "Broccoli", "Mushrooms", "Spinach", "Zucchini", "Lettuce", "Cucumber", "Beetroot"].includes(item.name)
    ),
    Fruits: billList.filter((item) => item.category === "Fruits"),
    Seeds: billList.filter((item) => item.category === "Seeds"),
    Fertilizers: billList.filter((item) => item.category === "Fertilizers"),
    Herbs: billList.filter((item) => item.category === "Herbs"),
    "Dairy Products": billList.filter(
      (item) =>
        item.category === "Dairy Products" &&
        !["Cabbage"].includes(item.name)
    ),
  };

  const totalAmount = billList.reduce((sum, item) => sum + Number(item.finalPrice), 0);

  const pageVariants = {
    initial: { opacity: 0, scale: 0.95 },
    animate: { opacity: 1, scale: 1, transition: { duration: 0.8, ease: "easeOut", staggerChildren: 0.1 } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1 } },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.9, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-teal-800 text-xl">Loading products...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-red-600 text-xl">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen p-6 font-sans ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-teal-50 via-emerald-50 to-cyan-50 text-gray-800"
      }`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <ToastContainer />
      {/* Header */}
      <motion.header
        className="flex justify-between items-center mb-8 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-4">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Logo"
            className="w-12 h-12 rounded-full border-2 border-teal-200"
            whileHover={{ scale: 1.1, rotate: 360 }}
          />
          <h1 className="text-2xl font-bold text-teal-800">
            {language === "English" ? "Farmer's Market" : "விவசாய சந்தை"}
          </h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.div
            className="relative p-2 bg-teal-100 rounded-full hover:bg-teal-200"
            whileHover={{ scale: 1.1 }}
          >
            <ShoppingCart className="w-6 h-6 text-teal-800" />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </motion.div>
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-teal-100 rounded-full hover:bg-teal-200"
            whileHover={{ scale: 1.1 }}
          >
            <Settings className="w-6 h-6 text-teal-800" />
          </motion.button>
          <motion.button
            className="p-2 bg-teal-100 rounded-full hover:bg-teal-200"
            whileHover={{ scale: 1.1 }}
          >
            <User className="w-6 h-6 text-teal-800" />
          </motion.button>
          <motion.button
            className="p-2 bg-red-100 rounded-full hover:bg-red-200"
            whileHover={{ scale: 1.1 }}
          >
            <LogOut className="w-6 h-6 text-red-800" />
          </motion.button>
        </div>
      </motion.header>

      {/* Settings Dropdown */}
      {showSettings && (
        <motion.div
          className="absolute top-20 right-6 p-4 bg-white rounded-2xl shadow-xl z-10"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-3">
            <div>
              <p className="font-semibold text-teal-800">{farmerInfo.name}</p>
              <p className="text-sm text-gray-600">{farmerInfo.email}</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded-lg border border-teal-200"
            >
              <option value="English">English</option>
              <option value="தமிழ்">தமிழ்</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants}>
        {/* Search and Voice Selection */}
        <div className="flex items-center space-x-4 mb-6">
          <input
            type="text"
            placeholder={language === "English" ? "Search products..." : "தயாரிப்புகளைத் தேடு..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-3 rounded-lg border border-teal-200 bg-white/90 focus:ring-2 focus:ring-teal-400 focus:outline-none"
          />
          <motion.button
            onClick={() => setIsListening(!isListening)}
            className={`p-3 rounded-full ${isListening ? "bg-red-500" : "bg-teal-500"} text-white`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8"
          variants={containerVariants}
        >
          {filteredProducts.map((product) => (
            <motion.div
              key={product.id}
              variants={itemVariants}
              onClick={() => toggleSelection(product)}
              className={`p-4 bg-white/90 rounded-2xl shadow-md hover:shadow-xl transition-all cursor-pointer border-2 ${
                selectedProducts.some((p) => p.id === product.id)
                  ? "border-teal-500"
                  : "border-transparent"
              }`}
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-40 object-cover rounded-lg mb-3"
              />
              <h3 className="text-lg font-semibold text-teal-800">
                {language === "English" ? product.name : product.tamilName}
              </h3>
              <p className="text-sm text-gray-600">{product.weight}</p>
              <p className="text-teal-700 font-medium">₹{product.price}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Add to Bill Button */}
        {selectedProducts.length > 0 && (
          <motion.button
            onClick={addToBill}
            className="w-full max-w-xs mx-auto block p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === "English" ? "Add to Bill" : "பில் சேர்"}
          </motion.button>
        )}

        {/* Bill Section */}
        {billList.length > 0 && (
          <motion.div
            className="mt-8 p-6 bg-white/90 rounded-2xl shadow-lg"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-bold text-teal-800 mb-4">
              {language === "English" ? "Your Bill" : "உங்கள் பில்"}
            </h2>
            {["Vegetables", "Fruits", "Seeds", "Dairy Products", "Herbs", "Fertilizers"].map(
              (category) =>
                categorizedBill[category].length > 0 && (
                  <div key={category} className="mb-6">
                    <h3 className="text-xl font-semibold text-teal-700">
                      {language === "English"
                        ? category
                        : {
                            Vegetables: "காய்கறிகள்",
                            Fruits: "பழங்கள்",
                            Seeds: "விதைகள்",
                            "Dairy Products": "பால் பொருட்கள்",
                            Fertilizers: "உரங்கள்",
                            Herbs: "மூலிகைகள்",
                          }[category]}
                    </h3>
                    {categorizedBill[category].map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center justify-between p-4 border-b border-teal-100"
                        variants={itemVariants}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg"
                          />
                          <div>
                            <p className="font-medium text-teal-800">
                              {language === "English" ? item.name : item.tamilName}
                            </p>
                            <p className="text-sm text-gray-600">{item.weight}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) =>
                              updateQuantity(item.id, parseInt(e.target.value) || 1)
                            }
                            className="w-16 p-2 rounded-lg border border-teal-200 text-center"
                            min="1"
                          />
                          <p className="text-teal-700 font-medium">₹{item.finalPrice}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    <p className="text-right font-semibold text-teal-800 mt-2">
                      {language === "English" ? "Subtotal" : "துணை மொத்தம்"}: ₹
                      {categorizedBill[category].reduce(
                        (sum, item) => sum + Number(item.finalPrice),
                        0
                      )}
                    </p>
                  </div>
                )
            )}
            <p className="text-2xl font-bold text-teal-800 text-right">
              {language === "English" ? "Total" : "மொத்தம்"}: ₹{totalAmount}
            </p>
            <motion.button
              onClick={() => navigate("/payment", { state: { billList, totalAmount } })}
              className="mt-4 w-full py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-md"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {language === "English" ? "Proceed to Payment" : "பணம் செலுத்துதலுக்கு செல்"}
            </motion.button>
          </motion.div>
        )}

        {/* Additional Features */}
        <motion.div
          className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6"
          variants={containerVariants}
        >
          {/* Disputes */}
          <div className="p-6 bg-white/90 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-teal-800 mb-4">
              {language === "English" ? "Dispute Section" : "புகார் பிரிவு"}
            </h2>
            <input
              type="text"
              value={newDispute}
              onChange={(e) => setNewDispute(e.target.value)}
              placeholder={
                language === "English" ? "Reply to query..." : "வாடிக்கையாளர்களின் கேள்விக்கு பதில்..."
              }
              className="w-full p-3 rounded-lg border border-teal-200 mb-3"
            />
            <button
              onClick={addDispute}
              className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700"
            >
              {language === "English" ? "Submit" : "சமர்ப்பி"}
            </button>
            {disputes.map((dispute, index) => (
              <p key={index} className="mt-2 text-teal-700">{dispute}</p>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductSelection;