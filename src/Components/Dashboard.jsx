import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Language translations (unchanged)
const translations = {
  en: {
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
    analytics: "Analytics",
    logout: "Logout",
    withdrawProduct: "Withdraw Product",
    feedback: "Feedback",
    newMessage: "New Message",
    currencyConverter: "Currency Converter",
    enterAmount: "Enter Amount",
    from: "From",
    to: "To",
    convert: "Convert",
    lightMode: "Light Mode",
    darkMode: "Dark Mode",
    enableLocation: "Please enable location access to view weather details.",
    farmingNews: "Farming News",
  },
  ta: {
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
    sellSurplus: "மீதமுள்ளவற்றை விற்கவும்",
    addProduct: "பொருள் சேர்க்கவும்",
    cropRecommendation: "பயிர் பரிந்துரை",
    ordersGraph: "ஆர்டர்கள் வரைபடம்",
    yourProducts: "உங்கள் பொருட்கள்",
    analytics: "பகுப்பாய்வு",
    logout: "வெளியேறு",
    withdrawProduct: "பொருளை திரும்பப் பெறவும்",
    feedback: "கருத்து",
    newMessage: "புதிய செய்தி",
    currencyConverter: "நாணய மாற்றி",
    enterAmount: "தொகையை உள்ளிடவும்",
    from: "இருந்து",
    to: "இற்கு",
    convert: "மாற்று",
    lightMode: "வெளிர் பயன்முறை",
    darkMode: "இருண்ட பயன்முறை",
    enableLocation: "வானிலை விவரங்களைப் பார்க்க, இடம் அணுகலை இயக்கவும்。",
    farmingNews: "விவசாய செய்திகள்",
  },
  hi: {
    helloFarmer: "नमस्ते, किसान!",
    settings: "सेटिंग्स",
    help: "सहायता",
    weather: "मौसम",
    confirmed: "पुष्टि की गई",
    dispatched: "प्रेषित",
    cancelled: "रद्द किया गया",
    previousOrders: "पिछले ऑर्डर",
    currentOrders: "वर्तमान ऑर्डर",
    totalEarnings: "कुल आय",
    marketPrices: "बाजार कीमतें",
    sellSurplus: "अधिक बेचें",
    addProduct: "उत्पाद जोड़ें",
    cropRecommendation: "फसल सिफारिश",
    ordersGraph: "ऑर्डर ग्राफ",
    yourProducts: "आपके उत्पाद",
    analytics: "विश्लेषण",
    logout: "लॉगआउट",
    withdrawProduct: "उत्पाद वापस लें",
    feedback: "प्रतिक्रिया",
    newMessage: "नया संदेश",
    currencyConverter: "मुद्रा परिवर्तक",
    enterAmount: "राशि दर्ज करें",
    from: "से",
    to: "को",
    convert: "परिवर्तन",
    lightMode: "हल्का मोड",
    darkMode: "डार्क मोड",
    enableLocation: "मौसम विवरण देखने के लिए, स्थान पहुँच सक्षम करें।",
    farmingNews: "कृषि समाचार",
  },
};

const Dashboard = () => {
  // Utility Functions (unchanged)
  const randomEarnings = () => Math.floor(Math.random() * 100000);
  const randomPrices = () => ({
    Carrots: Math.floor(Math.random() * 100),
    Tomatoes: Math.floor(Math.random() * 150),
    Onions: Math.floor(Math.random() * 200),
  });

  const randomCropRecommendation = () => {
    const crops = ["Tomatoes", "Carrots", "Potatoes", "Onions", "Cucumbers"];
    return crops[Math.floor(Math.random() * crops.length)];
  };

  const generateOrdersData = () => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "Orders",
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: "rgba(167, 243, 208, 0.6)",
      borderColor: "rgba(16, 185, 129, 1)",
      borderWidth: 1,
    }],
  });

  const generateAnalyticsData = () => ({
    labels: ["Carrots", "Tomatoes", "Onions", "Potatoes", "Apples"],
    datasets: [{
      label: "Sales",
      data: Array.from({ length: 5 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: [
        "rgba(239, 68, 68, 0.6)",
        "rgba(59, 130, 246, 0.6)",
        "rgba(245, 158, 11, 0.6)",
        "rgba(16, 185, 129, 0.6)",
        "rgba(139, 92, 246, 0.6)",
      ],
      borderColor: [
        "rgba(239, 68, 68, 1)",
        "rgba(59, 130, 246, 1)",
        "rgba(245, 158, 11, 1)",
        "rgba(16, 185, 129, 1)",
        "rgba(139, 92, 246, 1)",
      ],
      borderWidth: 1,
    }],
  });

  const generateMockVideo = () => ({
    title: "Farming Technology Overview",
    thumbnail: "https://via.placeholder.com/320x180?text=Farming+Video",
    url: "https://www.youtube.com/watch?v=mockVideo",
  });

  // State Declarations
  const [weather, setWeather] = useState(null);
  const [location, setLocation] = useState(null);
  const [showSettings, setShowSettings] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [fullScreenGraph, setFullScreenGraph] = useState(false); // Changed to boolean for showing both charts
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [selectedProducts] = useState([
    { id: 1, name: "Carrots", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" },
    { id: 2, name: "Tomatoes", image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469" },
    { id: 3, name: "Potatoes", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
    { id: 4, name: "Onions", image: "https://images.unsplash.com/photo-1618512496248-a07fecec27cd" },
    { id: 5, name: "Cucumbers", image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469" },
    { id: 6, name: "Peppers", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" },
    { id: 7, name: "Lettuce", image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469" },
    { id: 8, name: "Broccoli", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
    { id: 9, name: "Spinach", image: "https://images.unsplash.com/photo-1618512496248-a07fecec27cd" },
  ]);
  const [language, setLanguage] = useState("en");
  const [earnings] = useState(randomEarnings());
  const [prices] = useState(randomPrices());
  const [ordersData] = useState(generateOrdersData());
  const [analyticsData] = useState(generateAnalyticsData());
  const [cropRecommendation] = useState(randomCropRecommendation());
  const [newsData, setNewsData] = useState(null);
  const [youtubeVideo, setYoutubeVideo] = useState(null);
  const [error, setError] = useState(null);

  // Weather Fetch (unchanged)
  useEffect(() => {
    const fetchWeather = async (lat, lon) => {
      try {
        const apiKey = "350bfa82c3adbbcb64a94541981012fd";
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`
        );
        const locationResponse = await fetch(
          `https://api.openweathermap.org/geo/1.0/reverse?lat=${lat}&lon=${lon}&limit=1&appid=${apiKey}`
        );

        if (!weatherResponse.ok || !locationResponse.ok) throw new Error("Weather data fetch failed");

        const weatherData = await weatherResponse.json();
        const locationData = await locationResponse.json();

        setWeather(weatherData);
        setLocation(locationData[0]);
      } catch (error) {
        setError("Failed to fetch weather data");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        () => setError("Geolocation access denied")
      );
    } else {
      setError("Geolocation not supported");
    }
  }, []);

  // Currency Conversion (unchanged)
  useEffect(() => {
    const convertCurrency = async () => {
      try {
        const response = await fetch(
          `https://api.exchangerate-api.com/v4/latest/${fromCurrency}`
        );
        if (!response.ok) throw new Error("Currency fetch failed");
        const data = await response.json();
        const rate = data.rates[toCurrency];
        setConvertedAmount((amount * rate).toFixed(2));
      } catch (error) {
        setError("Failed to convert currency");
      }
    };
    if (amount && fromCurrency && toCurrency) convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  // Fetch News and YouTube Videos (unchanged)
  useEffect(() => {
    const fetchNewsAndVideos = async () => {
      try {
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=farming+agriculture&apiKey=c10e12d1c86649488db6669f6f0b6fee&language=en&pageSize=10`
        );
        if (!newsResponse.ok) throw new Error("News fetch failed");
        const newsData = await newsResponse.json();
        const randomNews = newsData.articles[Math.floor(Math.random() * newsData.articles.length)];
        setNewsData(randomNews);

        let youtubeData = null;
        try {
          const youtubeResponse = await fetch(
            `https://www.googleapis.com/youtube/v3/search?part=snippet&q=farming+technology&type=video&maxResults=10&key=AIzaSyD8lgoh2Adyq47IFjDy-WmO8Vt6OSzJf48`
          );
          if (!youtubeResponse.ok) throw new Error("YouTube fetch failed");
          youtubeData = await youtubeResponse.json();
          const randomVideo = youtubeData.items[Math.floor(Math.random() * youtubeData.items.length)];
          setYoutubeVideo({
            title: randomVideo.snippet.title,
            thumbnail: randomVideo.snippet.thumbnails.medium.url,
            url: `https://www.youtube.com/watch?v=${randomVideo.id.videoId}`,
          });
        } catch (youtubeError) {
          setYoutubeVideo(generateMockVideo());
        }

        const interval = setInterval(() => {
          const newNews = newsData.articles[Math.floor(Math.random() * newsData.articles.length)];
          setNewsData(newNews);

          if (youtubeData && youtubeData.items) {
            const newVideo = youtubeData.items[Math.floor(Math.random() * youtubeData.items.length)];
            setYoutubeVideo({
              title: newVideo.snippet.title,
              thumbnail: newVideo.snippet.thumbnails.medium.url,
              url: `https://www.youtube.com/watch?v=${newVideo.id.videoId}`,
            });
          } else {
            setYoutubeVideo(generateMockVideo());
          }
        }, 10000);

        return () => clearInterval(interval);
      } catch (error) {
        setNewsData(null);
        setYoutubeVideo(generateMockVideo());
        setError("Failed to fetch news or videos");
      }
    };

    fetchNewsAndVideos();
  }, []);

  // Chart Options (adjusted for smaller size)
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e3a8a", font: { size: 10 } } },
      title: { display: true, text: translations[language].ordersGraph, color: "#1e3a8a", font: { size: 12 } },
    },
    scales: {
      x: { ticks: { color: "#1e3a8a", font: { size: 8 } } },
      y: { ticks: { color: "#1e3a8a", font: { size: 8 } } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e3a8a", font: { size: 10 } } },
      title: { display: true, text: translations[language].analytics, color: "#1e3a8a", font: { size: 12 } },
    },
  };

  // Animation Variants (adjusted for faster transitions)
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.3, ease: "easeInOut" } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.5, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.05, type: "spring", stiffness: 120 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.4, ease: "easeOut", type: "spring", stiffness: 100 } },
  };

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

  const currencyFlags = {
    USD: "🇺🇸",
    INR: "🇮🇳",
    EUR: "🇪🇺",
    GBP: "🇬🇧",
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center p-4 bg-white rounded-lg shadow-lg">
          <h2 className="text-lg font-bold text-red-600 mb-1">Error</h2>
          <p className="text-gray-700 text-sm">{error}</p>
          <button
            className="mt-2 px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className={`min-h-screen max-h-screen p-4 flex flex-col ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-emerald-50 via-amber-50 to-indigo-50 text-gray-900"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {fullScreenGraph && (
        <motion.div
          className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-4 rounded-2xl w-11/12 max-w-5xl relative shadow-2xl">
            <button className="absolute top-2 right-2 text-2xl text-gray-600 hover:text-gray-800" onClick={() => setFullScreenGraph(false)}>×</button>
            <div className="flex justify-center space-x-4">
              <div className="w-1/2 h-57">
                <h3 className="text-center text-lg font-semibold text-rose-800 mb-2">Orders Graph</h3>
                <Bar data={ordersData} options={chartOptions} />
              </div>
              <div className="w-1/2 h-50">
                <h3 className="text-center text-lg font-semibold text-rose-800 mb-2">Analytics</h3>
                <Pie data={analyticsData} options={pieOptions} />
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-center mb-3 bg-transparent/90 backdrop-blur-md p-3 rounded-2xl shadow-lg border border-emerald-100"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-7 mb-2 md:mb-0 relative">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Farmer Logo"
            className="w-25 h-25 rounded-full border-2 border-emerald-300 object-cover shadow-md"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <div>
            <motion.h1
              className="text-2xl font-extrabold tracking-tight text-emerald-800"
              whileHover={{ scale: 1.05 }}
            >
              {translations[language].helloFarmer}
            </motion.h1>
            <div className="flex space-x-2 mt-3">
              <motion.button
                className="px-4 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md text-sm"
                onClick={() => setShowSettings(!showSettings)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations[language].settings}
              </motion.button>
              <motion.button
                className="px-4 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md text-sm"
                onClick={() => alert(translations[language].help)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations[language].help}
              </motion.button>
            </div>
            {showSettings && (
              <motion.div
                className="absolute top-full left-0 mt-2 p-4 bg-white rounded-2xl shadow-2xl border border-emerald-200 z-20"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                <button
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md w-full mb-2 text-sm"
                  onClick={() => setDarkMode(!darkMode)}
                >
                  {darkMode ? translations[language].lightMode : translations[language].darkMode}
                </button>
                <div className="flex space-x-2">
                  {["en", "ta", "hi"].map((lang) => (
                    <motion.button
                      key={lang}
                      className="px-3 py-1 bg-indigo-100 text-indigo-800 rounded-lg hover:bg-indigo-200 shadow-md text-sm"
                      onClick={() => setLanguage(lang)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {lang === "en" ? "English" : lang === "ta" ? "தமிழ்" : "हिंदी"}
                    </motion.button>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </div>

        <div className="flex space-x-5 mb-2 md:mb-0 w-full md:w-1/2 h-40 rounded-4xl">
          {["confirmed", "dispatched", "cancelled"].map((status, index) => (
            <motion.div
              key={status}
              variants={itemVariants}
              className={`p-2 rounded-lg shadow-md border flex-1 ${status === "confirmed"
                ? "bg-emerald-100 border-emerald-200"
                : status === "dispatched"
                ? "bg-amber-100 border-amber-200"
                : "bg-rose-100 border-rose-200"} hover:shadow-lg hover:scale-105 transition-all duration-300`}
            >
              <h3 className={`font-bold text-sm ${status === "confirmed" ? "text-emerald-800" : status === "dispatched" ? "text-amber-800" : "text-rose-800"}`}>
                {translations[language][status]}
              </h3>
              <p className={`mt-1 text-xs ${status === "confirmed" ? "text-emerald-900" : status === "dispatched" ? "text-amber-900" : "text-rose-900"}`}>
                Order #{127 + index * 2} - ₹{4000 - index * 1500}
              </p>
              <p className={`mt-1 text-xs ${status === "confirmed" ? "text-emerald-900" : status === "dispatched" ? "text-amber-900" : "text-rose-900"}`}>
                Order #{128 + index * 2} - ₹{2500 - index * 700}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="p-2 bg-gradient-to-r from-indigo-100 via-blue-100 to-cyan-100 rounded-lg shadow-md border border-indigo-200 hover:shadow-lg hover:scale-105 transition-all duration-300 md:w-1/4"
        >
          <h3 className="font-bold text-sm text-indigo-800 mb-1">{translations[language].weather}</h3>
          {!weather && <p className="text-gray-600 text-xs">{translations[language].enableLocation}</p>}
          {weather && location && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-1 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="inline-block"
              >
                <span className="text-3xl">{getWeatherEmoji(weather.weather[0].description)}</span>
              </motion.div>
              <p className="text-sm font-semibold text-indigo-900 mt-1 capitalize">{weather.weather[0].description}</p>
              <p className="text-lg font-bold text-cyan-800">{weather.main.temp}°C</p>
              <p className="text-xs text-gray-700">Location: {location.name}, {location.country}</p>
              <motion.p
                className="text-xs text-gray-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Humidity: {weather.main.humidity}% {weather.main.humidity > 70 ? "💧" : "🌬️"}
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Main Grid (Four Columns) */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 gap-4 flex-1 overflow-hidden"
        variants={containerVariants}
      >
        {/* Column 1 (Far Left) */}
        <div className="space-y-4 ml-2">
          <motion.div
            variants={itemVariants}
            className="p-3 bg-purple-100/90 rounded-lg shadow-md border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-sm text-purple-800">{translations[language].totalEarnings}</h3>
            <p className="mt-1 text-lg font-semibold text-purple-900">₹{earnings}</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-3 bg-emerald-100/90 rounded-lg shadow-md border border-emerald-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-sm text-emerald-800">{translations[language].currentOrders}</h3>
            <p className="mt-1 text-xs text-emerald-900">Order #125 - ₹2,000 (Pending)</p>
            <p className="mt-1 text-xs text-emerald-900">Order #126 - ₹1,500 (Processing)</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-3 bg-amber-100/90 rounded-lg shadow-md border border-amber-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-sm text-amber-800">{translations[language].previousOrders}</h3>
            <p className="mt-1 text-xs text-amber-900">Order #123 - ₹5,000</p>
            <p className="mt-1 text-xs text-amber-900">Order #124 - ₹3,500</p>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-3 bg-gradient-to-r from-amber-100 via-emerald-100 to-purple-100 rounded-lg shadow-md border border-purple-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-sm text-purple-800 mb-1">{translations[language].currencyConverter}</h3>
            <input
              type="number"
              placeholder={translations[language].enterAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-2 w-full rounded-lg text-gray-800 bg-white/95 border border-purple-300 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-sm text-xs"
            />
            <div className="flex space-x-2 mt-2">
              {["fromCurrency", "toCurrency"].map((type) => (
                <select
                  key={type}
                  value={type === "fromCurrency" ? fromCurrency : toCurrency}
                  onChange={(e) => type === "fromCurrency" ? setFromCurrency(e.target.value) : setToCurrency(e.target.value)}
                  className="p-2 w-1/2 rounded-lg text-gray-800 bg-white/95 border border-purple-300 focus:ring-1 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-sm text-xs"
                >
                  {Object.entries(currencyFlags).map(([code, flag]) => (
                    <option key={code} value={code}>{code} {flag}</option>
                  ))}
                </select>
              ))}
            </div>
            <motion.button
              className="mt-2 px-4 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md w-full text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].convert} 💰
            </motion.button>
            {convertedAmount && (
              <motion.p
                className="mt-2 text-purple-900 font-semibold text-center text-xs"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {amount} {currencyFlags[fromCurrency]} = {convertedAmount} {currencyFlags[toCurrency]}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Column 2 (Left-Middle) */}
        <div className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="p-3 bg-indigo-100/90 rounded-lg shadow-md border border-indigo-200 hover:shadow-lg hover:scale-105 transition-all duration-300 h-30 w-90"
          >
            <h3 className="font-bold text-sm text-indigo-800">{translations[language].sellSurplus}</h3>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-3 bg-orange-100/90 rounded-lg shadow-md border border-orange-200 hover:shadow-lg hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-sm text-orange-800 mb-1">{translations[language].cropRecommendation}</h3>
            <p className="text-orange-900 text-xs">Recommended Crop: {cropRecommendation}</p>
            <div className="mt-2">
              <h4 className="font-semibold text-sm text-orange-800">{translations[language].marketPrices}</h4>
              <ul className="mt-1 space-y-1 text-orange-900 text-xs">
                {Object.entries(prices).map(([item, price]) => (
                  <li key={item}>{item}: ₹{price}/kg</li>
                ))}
              </ul>
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-3 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-lg shadow-md border border-emerald-200 hover:shadow-lg transition-all duration-300"
          >
            <h3 className="font-bold text-sm text-emerald-800 mb-1">{translations[language].farmingNews}</h3>
            {newsData ? (
              <div>
                <p className="text-emerald-900 text-xs mb-2">{newsData.title}</p>
                {youtubeVideo && (
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-teal-800 text-xs mb-1">Recommended Video</p>
                    <a href={youtubeVideo.url} target="_blank" rel="noopener noreferrer">
                      <motion.img
                        src={youtubeVideo.thumbnail}
                        alt={youtubeVideo.title}
                        className="w-24 h-14 object-cover rounded-lg shadow-sm"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <p className="text-xs text-teal-900 mt-1 text-center">{youtubeVideo.title}</p>
                    </a>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-emerald-900 text-xs">Loading news...</p>
            )}
          </motion.div>
        </div>

        {/* Column 3 (Right-Middle) */}
        <div className="space-y-4">
          <motion.div
            variants={itemVariants}
            className="p-3 bg-rose-100/90 rounded-lg shadow-md border border-rose-200 hover:shadow-lg hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setFullScreenGraph(true)} // Will open the full-screen view with both charts
          >
            <h3 className="font-bold text-sm text-rose-800 mb-1">Analytics & Orders Graph</h3>
            <div className="mt-1 h-24">
              <Bar data={ordersData} options={chartOptions} /> {/* Default to Orders Graph */}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-3 bg-teal-100/90 rounded-lg shadow-md border border-teal-200 hover:shadow-lg hover:scale-105 transition-all duration-300 w-70 h-60"
          >
            <h3 className="font-bold text-sm text-teal-800 mb-1">{translations[language].yourProducts}</h3>
            <div className="grid grid-cols-3 gap-2 mt-1">
              {selectedProducts.slice(0, 9).map((product) => (
                <motion.img
                  key={product.id}
                  src={product.image}
                  alt={product.name}
                  className="w-14 h-14 object-cover rounded-lg border border-teal-300 shadow-sm"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>
        </div>

        {/* Column 4 (Far Right) */}
        <div className="space-y-7 flex flex-col items-center mt-30">
          <motion.button
            className="w-70 h-10 px-2 py-1 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 shadow-md text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert(translations[language].newMessage)}
          >
            {translations[language].newMessage}
          </motion.button>
          <motion.button
            className="w-70 h-10 px-2 py-1 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-md text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert(translations[language].feedback)}
          >
            {translations[language].feedback}
          </motion.button>
          <motion.button
            className="w-70 h-10 px-2 py-1 bg-orange-600 text-white rounded-lg hover:bg-orange-700 shadow-md text-sm"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => alert(translations[language].withdrawProduct)}
          >
            {translations[language].withdrawProduct}
          </motion.button>
          <Link to="/addpro">
            <motion.button
              className="w-70 h-10 px-2 py-1 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow-md text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].addProduct}
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;