import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { Mic, User, Settings, LogOut } from "lucide-react";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { ref, onValue, set } from 'firebase/database';
import { db } from '../firebase'; // Ensure correct path

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
  const [farmerInfo] = useState({ name: "John Doe", email: "john@example.com", id: "farmer123" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Language translations
  const translations = {
    "English": {
      addProducts: "Add Products",
      searchProducts: "Search products...",
      addToBill: "Add to Bill",
      yourBill: "Your Bill",
      subtotal: "Subtotal",
      total: "Total",
      submitBill: "Submit Bill",
      disputeSection: "Dispute Section",
      replyToQuery: "Reply to query...",
      submit: "Submit",
      vegetables: "Vegetables",
      fruits: "Fruits",
      seeds: "Seeds",
      dairyProducts: "Dairy Products",
      fertilizers: "Fertilizers",
      herbs: "Herbs",
    },
    "தமிழ்": {
      addProducts: "பொருட்களை சேர்",
      searchProducts: "தயாரிப்புகளைத் தேடு...",
      addToBill: "பில் சேர்",
      yourBill: "உங்கள் பில்",
      subtotal: "துணை மொத்தம்",
      total: "மொத்தம்",
      submitBill: "பில் சமர்ப்பி",
      disputeSection: "புகார் பிரிவு",
      replyToQuery: "வாடிக்கையாளர்களின் கேள்விக்கு பதில்...",
      submit: "சமர்ப்பி",
      vegetables: "காய்கறிகள்",
      fruits: "பழங்கள்",
      seeds: "விதைகள்",
      dairyProducts: "பால் பொருட்கள்",
      fertilizers: "உரங்கள்",
      herbs: "மூலிகைகள்",
    },
    "हिन्दी": {
      addProducts: "उत्पाद जोड़ें",
      searchProducts: "उत्पाद खोजें...",
      addToBill: "बिल में जोड़ें",
      yourBill: "आपका बिल",
      subtotal: "उप-योग",
      total: "कुल",
      submitBill: "बिल जमा करें",
      disputeSection: "विवाद अनुभाग",
      replyToQuery: "प्रश्न का जवाब दें...",
      submit: "जमा करें",
      vegetables: "सब्जियाँ",
      fruits: "फल",
      seeds: "बीज",
      dairyProducts: "डेयरी उत्पाद",
      fertilizers: "उर्वरक",
      herbs: "जड़ी-बूटियाँ",
    },
  };

  // Fetch products from Firebase Realtime Database
  useEffect(() => {
    setLoading(true);
    const productsRef = ref(db, 'products');
    const unsubscribe = onValue(
      productsRef,
      (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const productsArray = Object.entries(data).map(([key, value]) => ({
            id: key,
            name: value.name || "Unnamed Product",
            tamilName: value.tamilName || value.name,
            hindiName: value.hindiName || value.name, // Added Hindi name support
            image: value.image || "https://via.placeholder.com/150",
            weight: value.weight || "N/A",
            price: Number(value.price) || 0,
            category: value.category || "Uncategorized",
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
        setError(`Failed to load products: ${error.message}`);
        toast.error("Failed to load products", { position: "top-right", autoClose: 3000 });
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  // Voice Recognition Setup with Hindi support
  useEffect(() => {
    if (!("webkitSpeechRecognition" in window)) {
      toast.warn("Speech recognition is not supported in your browser", { position: "top-right", autoClose: 3000 });
      return;
    }

    const recognition = new window.webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language === "English" ? "en-US" : language === "தமிழ்" ? "ta-IN" : "hi-IN";

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript.toLowerCase();
      const product = products.find((p) =>
        language === "English"
          ? p.name.toLowerCase().includes(transcript)
          : language === "தமிழ்"
          ? p.tamilName?.toLowerCase().includes(transcript)
          : p.hindiName?.toLowerCase().includes(transcript)
      );
      if (product) {
        toggleSelection(product);
      } else {
        toast.info(`No product found for "${transcript}"`, { position: "top-right", autoClose: 2000 });
      }
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

  // Toggle product selection without duplicate toasters
  const toggleSelection = (product) => {
    setSelectedProducts((prev) => {
      const isSelected = prev.some((p) => p.id === product.id);
      if (isSelected) {
        return prev.filter((p) => p.id !== product.id);
      } else {
        return [...prev, { ...product, qty: 1, price: Number(product.price) || 0 }];
      }
    });
  };

  // Add selected products to bill
  const addToBill = () => {
    if (selectedProducts.length === 0) {
      toast.warn("Please select at least one product", { position: "top-right", autoClose: 2000 });
      return;
    }
    setBillList((prev) => [...prev, ...selectedProducts]);
    setSelectedProducts([]);
  };

  // Update quantity or price in bill
  const updateBillItem = (id, field, value) => {
    setBillList((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              [field]: field === "qty" ? Math.max(1, value) : Math.max(0, value),
            }
          : item
      )
    );
  };

  // Remove item from bill
  const removeItem = (id) => {
    setBillList((prev) => prev.filter((item) => item.id !== id));
  };

  // Submit bill to Firebase
  const submitBillToFirebase = () => {
    if (billList.length === 0) {
      toast.warn("Bill is empty. Add products before submitting.", { position: "top-right", autoClose: 2000 });
      return;
    }

    const billData = {
      farmerId: farmerInfo.id,
      products: billList.map((item) => ({
        id: item.id,
        name: item.name,
        qty: item.qty,
        price: item.price,
        total: item.qty * item.price,
      })),
      timestamp: Date.now(),
    };

    const billRef = ref(db, `farmers/${farmerInfo.id}/bills/${billData.timestamp}`);
    set(billRef, billData)
      .then(() => {
        toast.success("Bill successfully submitted!", { position: "top-right", autoClose: 2000 });
        setBillList([]);
      })
      .catch((error) => {
        console.error("Error submitting bill:", error);
        toast.error("Failed to submit bill", { position: "top-right", autoClose: 2000 });
      });
  };

  // Add dispute
  const addDispute = () => {
    if (newDispute.trim()) {
      setDisputes((prev) => [...prev, newDispute]);
      setNewDispute("");
      toast.success(translations[language].submit, { position: "top-right", autoClose: 2000 });
    } else {
      toast.warn("Please enter a dispute before submitting", { position: "top-right", autoClose: 2000 });
    }
  };

  const filteredProducts = products.filter((product) =>
    language === "English"
      ? product.name.toLowerCase().includes(searchTerm.toLowerCase())
      : language === "தமிழ்"
      ? product.tamilName?.toLowerCase().includes(searchTerm.toLowerCase())
      : product.hindiName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const categorizedBill = {
    Vegetables: billList.filter((item) => item.category === "Vegetables"),
    Fruits: billList.filter((item) => item.category === "Fruits"),
    Seeds: billList.filter((item) => item.category === "Seeds"),
    Fertilizers: billList.filter((item) => item.category === "Fertilizers"),
    Herbs: billList.filter((item) => item.category === "Herbs"),
    "Dairy Products": billList.filter((item) => item.category === "Dairy Products"),
  };

  const totalAmount = billList.reduce((sum, item) => sum + (item.qty * item.price), 0);

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
      className={`min-h-screen p-8 font-sans ${
        darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-teal-100 via-emerald-100 to-cyan-100 text-gray-800"
      }`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      <ToastContainer />
      {/* Header */}
      <motion.header
        className="flex justify-between items-center mb-10 bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-6 rounded-xl shadow-lg"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-4">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Logo"
            className="w-14 h-14 rounded-full border-2 border-white shadow-md"
            whileHover={{ scale: 1.1, rotate: 360 }}
          />
          <h1 className="text-3xl font-bold">{translations[language].addProducts}</h1>
        </div>
        <div className="flex items-center space-x-4">
          <motion.button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <Settings className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="p-2 bg-white/20 rounded-full hover:bg-white/30 transition-colors"
            whileHover={{ scale: 1.1 }}
          >
            <User className="w-6 h-6" />
          </motion.button>
          <motion.button
            className="p-2 bg-red-500/20 rounded-full hover:bg-red-500/30 transition-colors"
            whileHover={{ scale: 1.1 }}
            onClick={() => navigate("/get")}
          >
            <LogOut className="w-6 h-6 text-red-400" />
          </motion.button>
        </div>
      </motion.header>

      {/* Settings Dropdown */}
      {showSettings && (
        <motion.div
          className="absolute top-24 right-8 p-4 bg-white rounded-xl shadow-xl z-10 border border-teal-200"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="space-y-4">
            <div>
              <p className="font-semibold text-teal-800">{farmerInfo.name}</p>
              <p className="text-sm text-gray-600">{farmerInfo.email}</p>
            </div>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="w-full p-2 rounded-lg border border-teal-300 focus:ring-2 focus:ring-teal-400 focus:outline-none"
            >
              <option value="English">English</option>
              <option value="தமிழ்">தமிழ் (Tamil)</option>
              <option value="हिन्दी">हिन्दी (Hindi)</option>
            </select>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="w-full p-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </button>
          </div>
        </motion.div>
      )}

      {/* Main Content */}
      <motion.div className="max-w-7xl mx-auto" variants={containerVariants}>
        {/* Search and Voice Selection */}
        <div className="flex items-center space-x-4 mb-8">
          <input
            type="text"
            placeholder={translations[language].searchProducts}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 p-4 rounded-lg border border-teal-300 bg-white/90 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm"
          />
          <motion.button
            onClick={() => setIsListening(!isListening)}
            className={`p-4 rounded-full ${isListening ? "bg-red-500" : "bg-teal-500"} text-white shadow-md`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Mic className="w-6 h-6" />
          </motion.button>
        </div>

        {/* Product Grid */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mb-10"
          variants={containerVariants}
        >
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <motion.div
                key={product.id}
                variants={itemVariants}
                onClick={() => toggleSelection(product)}
                className={`p-5 bg-white rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer border-2 ${
                  selectedProducts.some((p) => p.id === product.id)
                    ? "border-teal-500"
                    : "border-transparent"
                }`}
                whileHover={{ y: -5 }}
              >
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover rounded-lg mb-4"
                  onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                />
                <h3 className="text-lg font-semibold text-teal-800">
                  {language === "English" ? product.name : language === "தமிழ்" ? product.tamilName || product.name : product.hindiName || product.name}
                </h3>
                <p className="text-sm text-gray-600">{product.weight}</p>
                <p className="text-teal-700 font-medium">₹{product.price.toFixed(2)}</p>
              </motion.div>
            ))
          ) : (
            <p className="col-span-full text-center text-gray-600">No products match your search.</p>
          )}
        </motion.div>

        {/* Add to Bill Button */}
        {selectedProducts.length > 0 && (
          <motion.button
            onClick={addToBill}
            className="w-full max-w-md mx-auto block p-4 bg-teal-600 text-white rounded-lg hover:bg-teal-700 shadow-lg transition-colors"
            variants={itemVariants}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {translations[language].addToBill}
          </motion.button>
        )}

        {/* Bill Section */}
        {billList.length > 0 && (
          <motion.div
            className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-teal-200"
            variants={containerVariants}
          >
            <h2 className="text-2xl font-bold text-teal-800 mb-6">{translations[language].yourBill}</h2>
            {["Vegetables", "Fruits", "Seeds", "Dairy Products", "Herbs", "Fertilizers"].map(
              (category) =>
                categorizedBill[category].length > 0 && (
                  <div key={category} className="mb-6">
                    <h3 className="text-xl font-semibold text-teal-700 mb-4">
                      {translations[language][category.toLowerCase()]}
                    </h3>
                    {categorizedBill[category].map((item) => (
                      <motion.div
                        key={item.id}
                        className="flex items-center justify-between p-4 border-b border-teal-100 hover:bg-teal-50 transition-colors rounded-lg"
                        variants={itemVariants}
                      >
                        <div className="flex items-center space-x-4">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-lg shadow-sm"
                            onError={(e) => (e.target.src = "https://via.placeholder.com/150")}
                          />
                          <div>
                            <p className="font-medium text-teal-800">
                              {language === "English" ? item.name : language === "தமிழ்" ? item.tamilName || item.name : item.hindiName || item.name}
                            </p>
                            <p className="text-sm text-gray-600">{item.weight}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <input
                            type="number"
                            value={item.qty}
                            onChange={(e) => updateBillItem(item.id, "qty", parseInt(e.target.value) || 1)}
                            className="w-16 p-2 rounded-lg border border-teal-300 text-center focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            min="1"
                          />
                          <input
                            type="number"
                            value={item.price}
                            onChange={(e) => updateBillItem(item.id, "price", parseFloat(e.target.value) || 0)}
                            className="w-20 p-2 rounded-lg border border-teal-300 text-center focus:ring-2 focus:ring-teal-400 focus:outline-none"
                            min="0"
                            step="0.01"
                          />
                          <p className="text-teal-700 font-medium">₹{(item.qty * item.price).toFixed(2)}</p>
                          <button
                            onClick={() => removeItem(item.id)}
                            className="text-red-600 hover:text-red-800 transition-colors"
                          >
                            ✕
                          </button>
                        </div>
                      </motion.div>
                    ))}
                    <p className="text-right font-semibold text-teal-800 mt-4">
                      {translations[language].subtotal}: ₹
                      {categorizedBill[category].reduce((sum, item) => sum + (item.qty * item.price), 0).toFixed(2)}
                    </p>
                  </div>
                )
            )}
            <p className="text-2xl font-bold text-teal-800 text-right">
              {translations[language].total}: ₹{totalAmount.toFixed(2)}
            </p>
            <motion.button
              onClick={submitBillToFirebase}
              className="mt-6 w-full py-4 bg-green-600 text-white rounded-lg hover:bg-green-700 shadow-lg transition-colors"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].submitBill}
            </motion.button>
          </motion.div>
        )}

        {/* Disputes Section */}
        <motion.div
          className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-teal-200"
          variants={containerVariants}
        >
          <h2 className="text-xl font-bold text-teal-800 mb-4">{translations[language].disputeSection}</h2>
          <input
            type="text"
            value={newDispute}
            onChange={(e) => setNewDispute(e.target.value)}
            placeholder={translations[language].replyToQuery}
            className="w-full p-3 rounded-lg border border-teal-300 mb-4 focus:ring-2 focus:ring-teal-400 focus:outline-none shadow-sm"
          />
          <button
            onClick={addDispute}
            className="w-full p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors shadow-md"
          >
            {translations[language].submit}
          </button>
          {disputes.map((dispute, index) => (
            <p key={index} className="mt-2 text-teal-700">{dispute}</p>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default ProductSelection;