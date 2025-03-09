import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

const translations = {
  "en-IN": {
    helloFarmer: "Hello, Farmer!",
    settings: "Settings",
    help: "Help",
    weather: "Weather",
    confirmed: "Confirmed",
    dispatched: "Dispatched",
    cancelled: "Cancelled",
    previousOrders: "Previous Orders",
    currentOrders: "Current Orders",
    totalEarnings: "Total Earnings",
    marketPrices: "Market Prices",
    sellSurplus: "Sell Surplus Product",
    addProduct: "Add Product",
    cropRecommendation: "Crop Recommendation",
    ordersGraph: "Orders Graph",
    yourProducts: "Your Products",
    logout: "Logout",
    withdrawProduct: "Withdraw Product",
    feedback: "Feedback",
    newMessage: "New Message",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    farmingNews: "Farming News",
    newToDashboard: "New to this dashboard?",
    yes: "Yes",
    no: "No",
    next: "Next",
    finish: "Finish",
    guideConfirmed: "View your confirmed orders here.",
    guideCancelled: "See cancelled orders in this section.",
    guideDispatched: "Track dispatched orders here.",
    guideTotalEarnings: "Check your total earnings from all orders.",
    guideCurrentOrders: "Monitor your ongoing orders here.",
    guidePreviousOrders: "View your past completed orders.",
    guideSellSurplus: "List your excess produce for sale here.",
    guideCropRecommendation: "Get crop suggestions based on market trends.",
    guideFarmingNews: "Stay updated with the latest farming news.",
    guideOrdersGraph: "Analyze your order trends with this graph.",
    guideYourProducts: "See all your listed products here.",
    guideWeather: "Check real-time weather updates for your area.",
    guideNewMessage: "Send or view messages and notifications.",
    guideFeedback: "Submit your feedback about the platform.",
    guideWithdrawProduct: "Remove products from your listings here.",
    guideAddProduct: "Add new products to sell in this section.",
  },
  "ta-IN": {
    helloFarmer: "வணக்கம், விவசாயி!",
    settings: "அமைப்புகள்",
    help: "உதவி",
    weather: "வானிலை",
    confirmed: "உறுதிப்படுத்தப்பட்டது",
    dispatched: "அனுப்பப்பட்டது",
    cancelled: "ரத்து செய்யப்பட்டது",
    previousOrders: "முந்தைய ஆர்டர்கள்",
    currentOrders: "தற்போதைய ஆர்டர்கள்",
    totalEarnings: "மொத்த வருவாய்",
    marketPrices: "சந்தை விலைகள்",
    sellSurplus: "உபரி பொருளை விற்கவும்",
    addProduct: "பொருளை சேர்",
    cropRecommendation: "பயிர் பரிந்துரை",
    ordersGraph: "ஆர்டர் வரைபடம்",
    yourProducts: "உங்கள் பொருட்கள்",
    logout: "வெளியேறு",
    withdrawProduct: "பொருளை திரும்பப் பெறு",
    feedback: "கருத்து",
    newMessage: "புதிய செய்தி",
    lightMode: "லைட் மோட்",
    darkMode: "டார்க் மோட்",
    farmingNews: "விவசாய செய்திகள்",
    newToDashboard: "இந்த டாஷ்போர்டுக்கு புதியவரா?",
    yes: "ஆம்",
    no: "இல்லை",
    next: "அடுத்து",
    finish: "முடி",
    guideConfirmed: "இங்கே உங்கள் உறுதிப்படுத்தப்பட்ட ஆர்டர்களைப் பார்க்கவும்.",
    guideCancelled: "இந்த பகுதியில் ரத்து செய்யப்பட்ட ஆர்டர்களைப் பார்க்கவும்。",
    guideDispatched: "இங்கே அனுப்பப்பட்ட ஆர்டர்களைக் கண்காணிக்கவும்。",
    guideTotalEarnings: "அனைத்து ஆர்டர்களிலிருந்து உங்கள் மொத்த வருவாயை சரிபார்க்கவும்。",
    guideCurrentOrders: "இங்கே உங்கள் தற்போதைய ஆர்டர்களைக் கண்காணிக்கவும்。",
    guidePreviousOrders: "உங்கள் முந்தைய முடிந்த ஆர்டர்களைப் பார்க்கவும்。",
    guideSellSurplus: "இங்கே உங்கள் உபரி பொருட்களை விற்பனைக்கு பட்டியலிடவும்。",
    guideCropRecommendation: "சந்தை போக்குகளின் அடிப்படையில் பயிர் பரிந்துரைகளைப் பெறவும்。",
    guideFarmingNews: "சமீபத்திய விவசாய செய்திகளுடன் புதுப்பித்த நிலையில் இருக்கவும்。",
    guideOrdersGraph: "இந்த வரைபடத்துடன் உங்கள் ஆர்டர் போக்குகளை பகுப்பாய்வு செய்யவும்。",
    guideYourProducts: "இங்கே உங்கள் பட்டியலிடப்பட்ட அனைத்து பொருட்களையும் பார்க்கவும்。",
    guideWeather: "உங்கள் பகுதிக்கான நிகழ்நேர வானிலை புதுப்பிப்புகளை சரிபார்க்கவும்。",
    guideNewMessage: "செய்திகளை அனுப்பவும் அல்லது பார்க்கவும் மற்றும் அறிவிப்புகளைப் பார்க்கவும்。",
    guideFeedback: "பிளாட்ஃபார்ம் பற்றிய உங்கள் கருத்தை சமர்ப்பிக்கவும்。",
    guideWithdrawProduct: "இங்கே உங்கள் பட்டியல்களிலிருந்து பொருட்களை அகற்றவும்。",
    guideAddProduct: "இந்த பகுதியில் புதிய பொருட்களை விற்க சேர்க்கவும்。",
  },
  "hi-IN": {
    helloFarmer: "नमस्ते, किसान!",
    settings: "सेटिंग्स",
    help: "सहायता",
    weather: "मौसम",
    confirmed: "पुष्टि की गई",
    dispatched: "भेजा गया",
    cancelled: "रद्द कर दिया गया",
    previousOrders: "पिछले ऑर्डर",
    currentOrders: "वर्तमान ऑर्डर",
    totalEarnings: "कुल आय",
    marketPrices: "बाजार मूल्य",
    sellSurplus: "अधिक उत्पाद बेचें",
    addProduct: "उत्पाद जोड़ें",
    cropRecommendation: "फसल सिफारिश",
    ordersGraph: "ऑर्डर ग्राफ",
    yourProducts: "आपके उत्पाद",
    logout: "लॉगआउट",
    withdrawProduct: "उत्पाद वापस लें",
    feedback: "प्रतिक्रिया",
    newMessage: "नया संदेश",
    lightMode: "लाइट मोड",
    darkMode: "डार्क मोड",
    farmingNews: "कृषि समाचार",
    newToDashboard: "क्या आप इस डैशबोर्ड में नए हैं?",
    yes: "हाँ",
    no: "नहीं",
    next: "अगला",
    finish: "समाप्त",
    guideConfirmed: "यहाँ अपने पुष्टि किए गए ऑर्डर देखें।",
    guideCancelled: "इस खंड में रद्द किए गए ऑर्डर देखें।",
    guideDispatched: "यहाँ भेजे गए ऑर्डर ट्रैक करें।",
    guideTotalEarnings: "सभी ऑर्डर से अपनी कुल आय जांचें।",
    guideCurrentOrders: "यहाँ अपने चल रहे ऑर्डर की निगरानी करें।",
    guidePreviousOrders: "अपने पिछले पूर्ण किए गए ऑर्डर देखें।",
    guideSellSurplus: "यहाँ अपने अतिरिक्त उत्पाद को बिक्री के लिए सूचीबद्ध करें।",
    guideCropRecommendation: "बाजार के रुझानों के आधार पर फसल सुझाव प्राप्त करें।",
    guideFarmingNews: "नवीनतम कृषि समाचारों के साथ अपडेट रहें।",
    guideOrdersGraph: "इस ग्राफ के साथ अपने ऑर्डर रुझानों का विश्लेषण करें।",
    guideYourProducts: "यहाँ अपने सभी सूचीबद्ध उत्पाद देखें।",
    guideWeather: "अपने क्षेत्र के लिए वास्तविक समय मौसम अपडेट जांचें।",
    guideNewMessage: "संदेश भेजें या देखें और सूचनाएँ देखें।",
    guideFeedback: "प्लेटफॉर्म के बारे में अपनी प्रतिक्रिया सबमिट करें।",
    guideWithdrawProduct: "यहाँ अपनी लिस्टिंग से उत्पाद हटाएँ।",
    guideAddProduct: "इस खंड में बिक्री के लिए नए उत्पाद जोड़ें।",
  },
  "en-US": {
    helloFarmer: "Hello, Farmer!",
    settings: "Settings",
    help: "Help",
    weather: "Weather",
    confirmed: "Confirmed",
    dispatched: "Dispatched",
    cancelled: "Canceled",
    previousOrders: "Previous Orders",
    currentOrders: "Current Orders",
    totalEarnings: "Total Earnings",
    marketPrices: "Market Prices",
    sellSurplus: "Sell Surplus Product",
    addProduct: "Add Product",
    cropRecommendation: "Crop Recommendation",
    ordersGraph: "Orders Graph",
    yourProducts: "Your Products",
    logout: "Logout",
    withdrawProduct: "Withdraw Product",
    feedback: "Feedback",
    newMessage: "New Message",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    farmingNews: "Farming News",
    newToDashboard: "New to this dashboard?",
    yes: "Yes",
    no: "No",
    next: "Next",
    finish: "Finish",
    guideConfirmed: "View your confirmed orders here.",
    guideCancelled: "See canceled orders in this section.",
    guideDispatched: "Track dispatched orders here.",
    guideTotalEarnings: "Check your total earnings from all orders.",
    guideCurrentOrders: "Monitor your ongoing orders here.",
    guidePreviousOrders: "View your past completed orders.",
    guideSellSurplus: "List your excess produce for sale here.",
    guideCropRecommendation: "Get crop suggestions based on market trends.",
    guideFarmingNews: "Stay updated with the latest farming news.",
    guideOrdersGraph: "Analyze your order trends with this graph.",
    guideYourProducts: "See all your listed products here.",
    guideWeather: "Check real-time weather updates for your area.",
    guideNewMessage: "Send or view messages and notifications.",
    guideFeedback: "Submit your feedback about the platform.",
    guideWithdrawProduct: "Remove products from your listings here.",
    guideAddProduct: "Add new products to sell in this section.",
  },
};

const audioFiles = {
  "en-IN": "/Audio/English India.mp3",
  "ta-IN": "/Audio/Tamil India.mp3",
  "hi-IN": "/Audio/Hindhi India.mp3",
  "en-US": "/Audio/English USA.mp3",
};

const getGuideSteps = (language) => {
  const durations = {
    "en-US": 46,
    "en-IN": 52,
    "hi-IN": 51,
    "ta-IN": 56,
  };
  const totalDuration = durations[language];
  const stepCount = 16;
  const stepDuration = totalDuration / stepCount;

  return [
    { id: "confirmed", target: ".confirmed", start: 0, end: stepDuration, textKey: "guideConfirmed" },
    { id: "cancelled", target: ".cancelled", start: stepDuration * 1, end: stepDuration * 2, textKey: "guideCancelled" },
    { id: "dispatched", target: ".dispatched", start: stepDuration * 2, end: stepDuration * 3, textKey: "guideDispatched" },
    { id: "totalEarnings", target: ".total-earnings", start: stepDuration * 3, end: stepDuration * 4, textKey: "guideTotalEarnings" },
    { id: "currentOrders", target: ".current-orders", start: stepDuration * 4, end: stepDuration * 5, textKey: "guideCurrentOrders" },
    { id: "previousOrders", target: ".previous-orders", start: stepDuration * 5, end: stepDuration * 6, textKey: "guidePreviousOrders" },
    { id: "sellSurplus", target: ".sell-surplus", start: stepDuration * 6, end: stepDuration * 7, textKey: "guideSellSurplus" },
    { id: "cropRecommendation", target: ".crop-recommendation", start: stepDuration * 7, end: stepDuration * 8, textKey: "guideCropRecommendation" },
    { id: "farmingNews", target: ".farming-news", start: stepDuration * 8, end: stepDuration * 9, textKey: "guideFarmingNews" },
    { id: "ordersGraph", target: ".orders-graph", start: stepDuration * 9, end: stepDuration * 10, textKey: "guideOrdersGraph" },
    { id: "yourProducts", target: ".your-products", start: stepDuration * 10, end: stepDuration * 11, textKey: "guideYourProducts" },
    { id: "weather", target: ".weather", start: stepDuration * 11, end: stepDuration * 12, textKey: "guideWeather" },
    { id: "newMessage", target: ".new-message", start: stepDuration * 12, end: stepDuration * 13, textKey: "guideNewMessage" },
    { id: "feedback", target: ".feedback", start: stepDuration * 13, end: stepDuration * 14, textKey: "guideFeedback" },
    { id: "withdrawProduct", target: ".withdraw-product", start: stepDuration * 14, end: stepDuration * 15, textKey: "guideWithdrawProduct" },
    { id: "addProduct", target: ".add-product", start: stepDuration * 15, end: totalDuration, textKey: "guideAddProduct" },
  ];
};

const Dashboard = () => {
  const [weather, setWeather] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [language, setLanguage] = useState("en-IN");
  const [earnings] = useState(25529);
  const [selectedProducts] = useState([
    { id: 1, name: "Carrots", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" },
    { id: 2, name: "Tomatoes", image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469" },
    { id: 3, name: "Potatoes", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
    { id: 4, name: "Onions", image: "https://images.unsplash.com/photo-1618512496248-a07fecec27cd" },
    { id: 5, name: "Spinach", image: "https://images.unsplash.com/photo-1618512496248-a07fecec27cd" },
  ]);
  const [showGuide, setShowGuide] = useState(false);
  const [guideStep, setGuideStep] = useState(0);
  const audioRef = useRef(null);

  const guideSteps = getGuideSteps(language);

  const ordersData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: translations[language].ordersGraph,
      data: [10, 20, 15, 30, 25, 40, 35],
      backgroundColor: "rgba(34, 197, 94, 0.6)",
      borderColor: "rgba(34, 197, 94, 1)",
      borderWidth: 1,
    }],
  };

  const prices = { Carrots: 88, Tomatoes: 137, Onions: 106 };
  const cropRecommendation = "Onions";

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 10 } } },
      title: { display: true, text: translations[language].ordersGraph, color: darkMode ? "#e5e7eb" : "#000000", font: { size: 14 } },
    },
    scales: {
      x: { ticks: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 8 } } },
      y: { ticks: { color: darkMode ? "#e5e7eb" : "#000000", font: { size: 8 } } },
    },
  };

  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      const apiKey = "ccd8b058961d7fefa87f1c29421d8bdf";
      const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
      try {
        const response = await fetch(url);
        const data = await response.json();
        setWeather({
          main: { temp: data.main.temp, humidity: data.main.humidity },
          weather: [{ description: data.weather[0].description }],
          name: data.name,
          country: data.sys.country,
        });
      } catch (error) {
        console.error("Failed to fetch weather data:", error);
        setWeather({ error: "Unable to fetch weather data" });
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          fetchWeather(latitude, longitude);
        },
        (error) => {
          console.error("Geolocation error:", error);
          setWeather({ error: "Location access denied. Using default data." });
          setWeather({
            main: { temp: 34.81, humidity: 24 },
            weather: [{ description: "broken clouds" }],
            name: "Sulur",
            country: "IN",
          });
        }
      );
    } else {
      console.error("Geolocation not supported by this browser.");
      setWeather({ error: "Geolocation not supported" });
    }
  }, []);

  const getWeatherEmoji = (description) => {
    const weatherMap = {
      "clear sky": "☀️",
      "few clouds": "⛅",
      "scattered clouds": "🌥️",
      "broken clouds": "🌦️",
      "shower rain": "🌧️",
      "rain": "🌧️",
      "thunderstorm": "⛈️",
      "snow": "❄️",
      "mist": "🌫️",
    };
    return weatherMap[description?.toLowerCase()] || "🌤️";
  };

  const pageVariants = {
    initial: { opacity: 0, y: 30 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: "easeOut" },
  };

  const glossyHover = {
    scale: 1.02,
    boxShadow: darkMode
      ? "0 0 10px rgba(255, 255, 255, 0.2)"
      : "0 0 10px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.2 },
  };

  useEffect(() => {
    if (showGuide) {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      const audio = new Audio(audioFiles[language]);
      audioRef.current = audio;
      audio.currentTime = guideSteps[guideStep].start;
      audio.play().catch((error) => console.error("Audio playback failed:", error));
      const duration = (guideSteps[guideStep].end - guideSteps[guideStep].start) * 1000;
      const timer = setTimeout(() => {
        if (guideStep < guideSteps.length - 1) {
          setGuideStep((prev) => prev + 1);
        } else {
          audio.pause();
          setShowGuide(false);
        }
      }, duration);
      return () => {
        clearTimeout(timer);
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
      };
    } else {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
    }
  }, [showGuide, guideStep, language]);

  useEffect(() => {
    if (showGuide) {
      const targetElement = document.querySelector(guideSteps[guideStep].target);
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    }
  }, [guideStep, showGuide]);

  return (
    <motion.div
      className={`min-h-screen p-4 ${darkMode ? "bg-gray-900 text-gray-100" : "bg-gradient-to-br from-green-50 via-yellow-50 to-blue-50 text-black"} ${showGuide ? "backdrop-blur-sm" : ""}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
      style={{ fontFamily: "Inter, sans-serif", fontSize: "0.9rem" }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start mb-6 space-y-4 md:space-y-0 md:space-x-6">
        <motion.div
          className="flex items-center space-x-4"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Farmer Logo"
            className="w-16 h-16 rounded-full border-2 border-green-300 object-cover shadow-md"
          />
          <div>
            <h2 className="text-2xl font-bold text-green-700">{translations[language].helloFarmer}</h2>
            <div className="relative mt-2">
              <motion.button
                className="px-3 py-1 bg-indigo-500 text-white rounded-full hover:bg-indigo-600 text-xs font-medium shadow-sm"
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                {translations[language].settings}
              </motion.button>
              {showSettings && (
                <motion.div
                  className={`absolute left-0 mt-1 w-48 ${darkMode ? "bg-gray-800 text-gray-200 border-gray-700" : "bg-white text-black border-gray-200"} rounded-md shadow-md border p-2 z-10`}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -10 }}
                  transition={{ duration: 0.2 }}
                  style={{ transformOrigin: "top left" }}
                >
                  <button
                    className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                    onClick={() => setDarkMode(!darkMode)}
                  >
                    {darkMode ? translations[language].lightMode : translations[language].darkMode}
                  </button>
                  <select
                    className="w-full text-left px-2 py-1 text-xs bg-transparent hover:bg-gray-100 dark:hover:bg-gray-700 rounded focus:outline-none"
                    value={language}
                    onChange={(e) => {
                      setLanguage(e.target.value);
                      if (audioRef.current) {
                        audioRef.current.pause();
                        audioRef.current.currentTime = 0;
                      }
                      setGuideStep(0);
                    }}
                  >
                    <option value="en-IN" className="text-black">English (India)</option>
                    <option value="ta-IN" className="text-black">தமிழ் (Tamil)</option>
                    <option value="hi-IN" className="text-black">हिन्दी (Hindi)</option>
                    <option value="en-US" className="text-black">English (US)</option>
                  </select>
                  <button className="w-full text-left px-2 py-1 text-xs hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    {translations[language].help}
                  </button>
                  <button className="w-full text-left px-2 py-1 text-xs text-red-600 hover:bg-gray-100 dark:hover:bg-gray-700 rounded">
                    {translations[language].logout}
                  </button>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full md:w-2/3 order-status">
          {["confirmed", "dispatched", "cancelled"].map((status, index) => (
            <motion.div
              key={status}
              className={`p-4 rounded-lg shadow-md border ${status} ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} h-36 w-full ${showGuide && guideSteps[guideStep].id === status ? "z-30" : ""}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={glossyHover}
            >
              <h3 className={`font-semibold text-lg ${status === "confirmed" ? "text-green-600" : status === "dispatched" ? "text-yellow-600" : "text-red-600"}`}>
                {translations[language][status]}
              </h3>
              <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>
                Order #{127 + index * 2} - ₹{4000 - index * 1500}
              </p>
              <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>
                Order #{128 + index * 2} - ₹{2500 - index * 700}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          className={`p-4 rounded-lg shadow-md border weather ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} w-full md:w-64 ${showGuide && guideSteps[guideStep].id === "weather" ? "z-30" : ""}`}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          whileHover={glossyHover}
        >
          <h3 className="font-semibold text-lg text-blue-600">{translations[language].weather}</h3>
          {weather ? (
            weather.error ? (
              <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>{weather.error}</p>
            ) : (
              <div className="mt-2 text-center">
                <span className="text-4xl">{getWeatherEmoji(weather.weather[0].description)}</span>
                <p className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-black"} mt-2 capitalize`}>{weather.weather[0].description}</p>
                <p className="text-2xl font-bold text-blue-600">{weather.main.temp}°C</p>
                <p className={`text-sm ${darkMode ? "text-gray-200" : "text-black"} mt-1`}>Location: {weather.name}, {weather.country}</p>
                <p className={`text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Humidity: {weather.main.humidity}%</p>
              </div>
            )
          ) : (
            <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Fetching weather...</p>
          )}
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-4 earnings-orders">
          <motion.div
            className={`p-4 rounded-lg shadow-md border total-earnings ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} ${showGuide && guideSteps[guideStep].id === "totalEarnings" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-green-600">{translations[language].totalEarnings}</h3>
            <p className={`mt-2 text-3xl font-bold ${darkMode ? "text-gray-100" : "text-black"}`}>₹{earnings}</p>
          </motion.div>

          <motion.div
            className={`p-4 rounded-lg shadow-md border current-orders ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} ${showGuide && guideSteps[guideStep].id === "currentOrders" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-green-600">{translations[language].currentOrders}</h3>
            <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Order #125 - ₹2,000 (Pending)</p>
            <p className={`mt-1 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Order #126 - ₹1,500 (Processing)</p>
          </motion.div>

          <motion.div
            className={`p-4 rounded-lg shadow-md border previous-orders ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} ${showGuide && guideSteps[guideStep].id === "previousOrders" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-yellow-600">{translations[language].previousOrders}</h3>
            <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Order #123 - ₹5,000</p>
            <p className={`mt-1 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Order #124 - ₹3,500</p>
          </motion.div>
        </div>

        <div className="space-y-4 recommendations">
          <motion.div
            className={`p-4 rounded-lg shadow-md border sell-surplus ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} ${showGuide && guideSteps[guideStep].id === "sellSurplus" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-blue-600">{translations[language].sellSurplus}</h3>
            <motion.button
              className="mt-2 px-3 py-1 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-xs font-medium shadow-sm"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {translations[language].sellSurplus}
            </motion.button>
          </motion.div>

          <motion.div
            className={`p-4 rounded-lg shadow-md border crop-recommendation ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} ${showGuide && guideSteps[guideStep].id === "cropRecommendation" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-orange-600">{translations[language].cropRecommendation}</h3>
            <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Recommended Crop: {cropRecommendation}</p>
            <h4 className="font-semibold text-lg text-orange-600 mt-2">{translations[language].marketPrices}</h4>
            <ul className="mt-1 space-y-1 text-sm">
              {Object.entries(prices).map(([item, price]) => (
                <li key={item} className={`text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>{item}: ₹{price}/kg</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            className={`p-4 rounded-lg shadow-md border farming-news ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} ${showGuide && guideSteps[guideStep].id === "farmingNews" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-green-600">{translations[language].farmingNews}</h3>
            <p className={`mt-2 text-sm ${darkMode ? "text-gray-200" : "text-black"}`}>Latest updates on farming techniques...</p>
          </motion.div>
        </div>

        <div className="space-y-4 products-graph">
          <motion.div
            className={`p-4 rounded-lg shadow-md border orders-graph ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} h-72 ${showGuide && guideSteps[guideStep].id === "ordersGraph" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-red-600">{translations[language].ordersGraph}</h3>
            <div className="mt-2 h-56">
              <Bar data={ordersData} options={chartOptions} />
            </div>
          </motion.div>

          <motion.div
            className={`p-4 rounded-lg shadow-md border your-products ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-100"} ${showGuide && guideSteps[guideStep].id === "yourProducts" ? "z-30" : ""}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.4 }}
            whileHover={glossyHover}
          >
            <h3 className="font-semibold text-lg text-teal-600">{translations[language].yourProducts}</h3>
            <div className="grid grid-cols-3 gap-4 mt-2">
              {selectedProducts.map((product) => (
                <motion.div
                  key={product.id}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                  transition={{ duration: 0.2 }}
                >
                  <img src={product.image} alt={product.name} className="w-16 h-16 object-cover rounded-md border border-teal-200" />
                  <p className={`text-sm ${darkMode ? "text-gray-200" : "text-black"} mt-1 text-center`}>{product.name}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>

        <div className="space-y-4 flex flex-col items-center actions">
          <motion.button
            className={`w-full py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-sm font-medium shadow-sm new-message ${showGuide && guideSteps[guideStep].id === "newMessage" ? "z-30" : ""}`}
            onClick={() => alert(translations[language].newMessage)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {translations[language].newMessage}
          </motion.button>
          <motion.button
            className={`w-full py-2 bg-purple-500 text-white rounded-full hover:bg-purple-600 text-sm font-medium shadow-sm feedback ${showGuide && guideSteps[guideStep].id === "feedback" ? "z-30" : ""}`}
            onClick={() => alert(translations[language].feedback)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {translations[language].feedback}
          </motion.button>
          <motion.button
            className={`w-full py-2 bg-orange-500 text-white rounded-full hover:bg-orange-600 text-sm font-medium shadow-sm withdraw-product ${showGuide && guideSteps[guideStep].id === "withdrawProduct" ? "z-30" : ""}`}
            onClick={() => alert(translations[language].withdrawProduct)}
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.2 }}
          >
            {translations[language].withdrawProduct}
          </motion.button>
          <Link to="/addpro" className="w-full">
            <motion.button
              className={`w-full py-2 bg-green-500 text-white rounded-full hover:bg-green-600 text-sm font-medium shadow-sm add-product ${showGuide && guideSteps[guideStep].id === "addProduct" ? "z-30" : ""}`}
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              {translations[language].addProduct}
            </motion.button>
          </Link>
        </div>
      </div>

      {/* Quick Start Guide Trigger */}
      {!showGuide && (
        <motion.div
          className={`fixed bottom-4 right-4 p-3 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-black"} rounded-md shadow-md border ${darkMode ? "border-gray-700" : "border-gray-200"}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <p className="text-sm font-medium">{translations[language].newToDashboard}</p>
          <div className="flex space-x-2 mt-2">
            <button
              className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 text-xs font-medium"
              onClick={() => {
                setShowGuide(true);
                setGuideStep(0);
              }}
            >
              {translations[language].yes}
            </button>
            <button
              className="px-3 py-1 bg-gray-500 text-white rounded-full hover:bg-gray-600 text-xs font-medium"
              onClick={() => setShowGuide(false)}
            >
              {translations[language].no}
            </button>
          </div>
        </motion.div>
      )}

      {/* Quick Start Guide */}
      {showGuide && (
        <motion.div
          className="fixed inset-0 z-20 pointer-events-none"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <div className="relative pointer-events-auto" onClick={(e) => e.stopPropagation()}>
            <motion.div
              className={`absolute p-4 ${darkMode ? "bg-gray-800 text-gray-200" : "bg-white text-black"} rounded-md shadow-md border ${darkMode ? "border-gray-700" : "border-gray-200"} z-40`}
              style={{
                top: (document.querySelector(guideSteps[guideStep].target)?.getBoundingClientRect().top || 0) - 120 + window.scrollY,
                left: "50%",
                transform: "translateX(-50%)",
                width: "300px",
              }}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm mb-2">{translations[language][guideSteps[guideStep].textKey]}</p>
              <div className="flex space-x-2">
                <button
                  className="px-3 py-1 bg-green-500 text-white rounded-full hover:bg-green-600 text-xs font-medium"
                  onClick={() => {
                    if (guideStep < guideSteps.length - 1) {
                      setGuideStep((prev) => prev + 1);
                    } else {
                      if (audioRef.current) audioRef.current.pause();
                      setShowGuide(false);
                    }
                  }}
                >
                  {guideStep < guideSteps.length - 1 ? translations[language].next : translations[language].finish}
                </button>
                {guideStep > 0 && (
                  <button
                    className="px-3 py-1 bg-gray-500 text-white rounded-full hover:bg-gray-600 text-xs font-medium"
                    onClick={() => setGuideStep((prev) => prev - 1)}
                  >
                    Back
                  </button>
                )}
                <button
                  className="px-3 py-1 bg-red-500 text-white rounded-full hover:bg-red-600 text-xs font-medium"
                  onClick={() => {
                    if (audioRef.current) audioRef.current.pause();
                    setShowGuide(false);
                  }}
                >
                  Close
                </button>
              </div>
            </motion.div>

            <motion.div
              className="absolute border-4 border-green-500 rounded-lg shadow-lg pointer-events-none z-20"
              style={{
                top: (document.querySelector(guideSteps[guideStep].target)?.getBoundingClientRect().top || 0) - 8 + window.scrollY,
                left: (document.querySelector(guideSteps[guideStep].target)?.getBoundingClientRect().left || 0) - 8,
                width: (document.querySelector(guideSteps[guideStep].target)?.offsetWidth || 0) + 16,
                height: (document.querySelector(guideSteps[guideStep].target)?.offsetHeight || 0) + 16,
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2 }}
            />
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

export default Dashboard;