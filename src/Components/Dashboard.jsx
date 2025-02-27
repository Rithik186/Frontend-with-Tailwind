import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from "chart.js";
import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

// Language translations (unchanged from your original)
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
    sellSurplus: "Sell Surplus",
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
  // Utility Functions
  const randomEarnings = () => Math.floor(Math.random() * 100000);
  const randomPrices = () => ({
    Carrots: Math.floor(Math.random() * 200),
    Tomatoes: Math.floor(Math.random() * 300),
    Onions: Math.floor(Math.random() * 400),
  });

  const generateOrdersData = () => ({
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
    datasets: [{
      label: "Orders",
      data: Array.from({ length: 7 }, () => Math.floor(Math.random() * 100)),
      backgroundColor: "rgba(167, 243, 208, 0.6)",
      borderColor: "rgba(16, 185, 129, 1)",
      borderWidth: 2,
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
      borderWidth: 2,
    }],
  });

  // Mock YouTube Video Fallback
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
  const [fullScreenGraph, setFullScreenGraph] = useState(null);
  const [fromCurrency, setFromCurrency] = useState("USD");
  const [toCurrency, setToCurrency] = useState("INR");
  const [amount, setAmount] = useState(1);
  const [convertedAmount, setConvertedAmount] = useState(null);
  const [selectedProducts] = useState([
    { id: 1, name: "Carrots", image: "https://images.unsplash.com/photo-1598170845058-32b9d6a5da37" },
    { id: 2, name: "Tomatoes", image: "https://images.unsplash.com/photo-1607305387299-a3d9611cd469" },
    { id: 3, name: "Potatoes", image: "https://images.unsplash.com/photo-1518977676601-b53f82aba655" },
    { id: 4, name: "Onions", image: "https://images.unsplash.com/photo-1618512496248-a07fecec27cd" },
  ]);
  const [language, setLanguage] = useState("en");
  const [earnings] = useState(randomEarnings());
  const [prices] = useState(randomPrices());
  const [ordersData] = useState(generateOrdersData());
  const [analyticsData] = useState(generateAnalyticsData());
  const [newsData, setNewsData] = useState(null);
  const [youtubeVideo, setYoutubeVideo] = useState(null);
  const [error, setError] = useState(null);

  // Weather Fetch (OpenWeatherMap API)
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
        console.error("Error fetching weather/location:", error);
        setWeather(null);
        setLocation(null);
        setError("Failed to fetch weather data");
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => fetchWeather(position.coords.latitude, position.coords.longitude),
        (error) => {
          console.error("Geolocation error:", error);
          setError("Geolocation access denied");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser");
    }
  }, []);

  // Currency Conversion (ExchangeRate-API)
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
        console.error("Error converting currency:", error);
        setConvertedAmount(null);
        setError("Failed to convert currency");
      }
    };
    if (amount && fromCurrency && toCurrency) convertCurrency();
  }, [amount, fromCurrency, toCurrency]);

  // Fetch News and YouTube Videos with Fallback
  useEffect(() => {
    const fetchNewsAndVideos = async () => {
      try {
        // Fetch News from NewsAPI
        const newsResponse = await fetch(
          `https://newsapi.org/v2/everything?q=farming+agriculture&apiKey=c10e12d1c86649488db6669f6f0b6fee&language=en&pageSize=10`
        );
        if (!newsResponse.ok) throw new Error("News fetch failed");
        const newsData = await newsResponse.json();
        const randomNews = newsData.articles[Math.floor(Math.random() * newsData.articles.length)];
        setNewsData(randomNews);

        // Fetch YouTube Videos with Fallback
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
          console.error("YouTube fetch error:", youtubeError);
          setYoutubeVideo(generateMockVideo()); // Fallback to mock video
        }

        // Periodic Rotation
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
            setYoutubeVideo(generateMockVideo()); // Continue with mock if YouTube failed initially
          }
        }, 10000);

        return () => clearInterval(interval);
      } catch (error) {
        console.error("Error fetching news/videos:", error);
        setNewsData(null);
        setYoutubeVideo(generateMockVideo()); // Fallback for both if NewsAPI fails too
        setError("Failed to fetch news or videos");
      }
    };

    fetchNewsAndVideos();
  }, []);

  // Chart Options
  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e3a8a" } },
      title: { display: true, text: translations[language].ordersGraph, color: "#1e3a8a" },
    },
    scales: {
      x: { ticks: { color: "#1e3a8a" } },
      y: { ticks: { color: "#1e3a8a" } },
    },
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top", labels: { color: "#1e3a8a" } },
      title: { display: true, text: translations[language].analytics, color: "#1e3a8a" },
    },
  };

  // Animation Variants
  const pageVariants = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.5, ease: "easeInOut" } },
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 50, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.8, ease: "easeOut", when: "beforeChildren", staggerChildren: 0.1, type: "spring", stiffness: 120 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.6, ease: "easeOut", type: "spring", stiffness: 100 } },
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
        <div className="text-center p-6 bg-white rounded-lg shadow-lg">
          <h2 className="text-2xl font-bold text-red-600 mb-2">Error</h2>
          <p className="text-gray-700">{error}</p>
          <button
            className="mt-4 px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
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
      className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gradient-to-br from-emerald-50 via-amber-50 to-indigo-50 text-gray-900"}`}
      variants={pageVariants}
      initial="initial"
      animate="animate"
    >
      {fullScreenGraph && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="bg-white p-6 rounded-2xl w-11/12 max-w-4xl relative shadow-2xl">
            <button className="absolute top-4 right-4 text-3xl text-gray-600 hover:text-gray-800" onClick={() => setFullScreenGraph(null)}>×</button>
            {fullScreenGraph === "orders" && <Bar data={ordersData} options={chartOptions} />}
            {fullScreenGraph === "analytics" && <Pie data={analyticsData} options={pieOptions} />}
          </div>
        </motion.div>
      )}

      {/* Header */}
      <motion.div
        className="flex flex-col md:flex-row justify-between items-center mb-8 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-emerald-100"
        variants={containerVariants}
      >
        <div className="flex items-center space-x-6 mb-4 md:mb-0 relative">
          <motion.img
            src="https://i.pinimg.com/736x/a8/f4/6a/a8f46ad882c293af8c3fe011ce13bbb0.jpg"
            alt="Farmer Logo"
            className="w-28 h-28 rounded-full border-4 border-emerald-300 object-cover shadow-md"
            whileHover={{ scale: 1.1, rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <motion.h1
            className="text-4xl font-extrabold tracking-tight text-emerald-800"
            whileHover={{ scale: 1.05 }}
          >
            {translations[language].helloFarmer}
          </motion.h1>
          <div className="flex space-x-4">
            <motion.button
              className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg text-lg font-medium"
              onClick={() => setShowSettings(!showSettings)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].settings}
            </motion.button>
            <motion.button
              className="px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg text-lg font-medium"
              onClick={() => alert(translations[language].help)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].help}
            </motion.button>
          </div>
          {showSettings && (
            <motion.div
              className="absolute top-full left-0 mt-3 p-6 bg-white rounded-2xl shadow-2xl border border-emerald-200 z-20"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              <button
                className="px-6 py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 shadow-lg w-full mb-3"
                onClick={() => setDarkMode(!darkMode)}
              >
                {darkMode ? translations[language].lightMode : translations[language].darkMode}
              </button>
              <div className="flex space-x-3">
                {["en", "ta", "hi"].map((lang) => (
                  <motion.button
                    key={lang}
                    className="px-4 py-2 bg-indigo-100 text-indigo-800 rounded-xl hover:bg-indigo-200 shadow-md"
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

        <div className="flex space-x-4 mb-4 md:mb-0 w-full md:w-1/2">
          {["confirmed", "dispatched", "cancelled"].map((status, index) => (
            <motion.div
              key={status}
              variants={itemVariants}
              className={`p-4 rounded-2xl shadow-lg border flex-1 ${status === "confirmed"
                ? "bg-emerald-100 border-emerald-200"
                : status === "dispatched"
                ? "bg-amber-100 border-amber-200"
                : "bg-rose-100 border-rose-200"} hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <h3 className={`font-bold text-lg ${status === "confirmed" ? "text-emerald-800" : status === "dispatched" ? "text-amber-800" : "text-rose-800"}`}>
                {translations[language][status]}
              </h3>
              <p className={`mt-2 ${status === "confirmed" ? "text-emerald-900" : status === "dispatched" ? "text-amber-900" : "text-rose-900"}`}>
                Order #{127 + index * 2} - ₹{4000 - index * 1500}
              </p>
              <p className={`mt-1 ${status === "confirmed" ? "text-emerald-900" : status === "dispatched" ? "text-amber-900" : "text-rose-900"}`}>
                Order #{128 + index * 2} - ₹{2500 - index * 700}
              </p>
            </motion.div>
          ))}
        </div>

        <motion.div
          variants={itemVariants}
          className="p-4 bg-gradient-to-r from-indigo-100 via-blue-100 to-cyan-100 rounded-2xl shadow-xl border border-indigo-200 hover:shadow-2xl hover:scale-105 transition-all duration-300 w-full md:w-1/4"
        >
          <h3 className="font-bold text-lg text-indigo-800 mb-2">{translations[language].weather}</h3>
          {!weather && <p className="text-gray-600">{translations[language].enableLocation}</p>}
          {weather && location && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 text-center"
            >
              <motion.div
                animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className="inline-block"
              >
                <span className="text-5xl">{getWeatherEmoji(weather.weather[0].description)}</span>
              </motion.div>
              <p className="text-xl font-semibold text-indigo-900 mt-2 capitalize">{weather.weather[0].description}</p>
              <p className="text-3xl font-bold text-cyan-800">{weather.main.temp}°C</p>
              <p className="text-sm text-gray-700">Location: {location.name}, {location.country}</p>
              <motion.p
                className="text-sm text-gray-600"
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ repeat: Infinity, duration: 2 }}
              >
                Humidity: {weather.main.humidity}% {weather.main.humidity > 70 ? "💧" : "🌬️"}
              </motion.p>
            </motion.div>
          )}
        </motion.div>
      </motion.div>

      {/* Main Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
        variants={containerVariants}
      >
        {/* Left Column */}
        <div className="space-y-6">
          {[
            { title: "previousOrders", color: "amber", data: ["Order #123 - ₹5,000", "Order #124 - ₹3,500"] },
            { title: "currentOrders", color: "emerald", data: ["Order #125 - ₹2,000 (Pending)", "Order #126 - ₹1,500 (Processing)"] },
            { title: "totalEarnings", color: "purple", data: [`₹${earnings}`] },
          ].map((section) => (
            <motion.div
              key={section.title}
              variants={itemVariants}
              className={`p-6 bg-${section.color}-100/90 rounded-2xl shadow-lg border border-${section.color}-200 hover:shadow-xl hover:scale-105 transition-all duration-300`}
            >
              <h3 className={`font-bold text-xl text-${section.color}-800`}>{translations[language][section.title]}</h3>
              {section.data.map((item, index) => (
                <p key={index} className={`mt-${index === 0 ? 2 : 1} text-${section.color}-900 ${section.title === "totalEarnings" ? "text-3xl font-semibold" : ""}`}>
                  {item}
                </p>
              ))}
            </motion.div>
          ))}

          <motion.div
            variants={itemVariants}
            className="p-6 bg-gradient-to-r from-amber-100 via-emerald-100 to-purple-100 rounded-2xl shadow-lg border border-purple-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-xl text-purple-800 mb-3">{translations[language].currencyConverter}</h3>
            <input
              type="number"
              placeholder={translations[language].enterAmount}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="p-3 w-full rounded-xl text-gray-800 bg-white/95 border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-sm"
            />
            <div className="flex space-x-3 mt-3">
              {["fromCurrency", "toCurrency"].map((type) => (
                <select
                  key={type}
                  value={type === "fromCurrency" ? fromCurrency : toCurrency}
                  onChange={(e) => type === "fromCurrency" ? setFromCurrency(e.target.value) : setToCurrency(e.target.value)}
                  className="p-3 w-1/2 rounded-xl text-gray-800 bg-white/95 border border-purple-300 focus:ring-2 focus:ring-purple-500 focus:outline-none transition-all duration-300 shadow-sm"
                >
                  {Object.entries(currencyFlags).map(([code, flag]) => (
                    <option key={code} value={code}>{code} {flag}</option>
                  ))}
                </select>
              ))}
            </div>
            <motion.button
              className="mt-4 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 shadow-lg w-full"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {translations[language].convert} 💰
            </motion.button>
            {convertedAmount && (
              <motion.p
                className="mt-3 text-purple-900 font-semibold text-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
              >
                {amount} {currencyFlags[fromCurrency]} = {convertedAmount} {currencyFlags[toCurrency]}
              </motion.p>
            )}
          </motion.div>
        </div>

        {/* Middle Column */}
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 bg-orange-100/90 rounded-2xl shadow-lg border border-orange-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-xl text-orange-800">{translations[language].marketPrices}</h3>
            <ul className="mt-2 space-y-2 text-orange-900">
              {Object.entries(prices).map(([item, price]) => (
                <li key={item}>{item}: ₹{price}/kg</li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 bg-indigo-100/90 rounded-2xl shadow-lg border border-indigo-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-xl text-indigo-800">{translations[language].sellSurplus}</h3>
            <Link to="/addpro">
              <motion.button
                className="mt-3 px-6 py-3 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-lg w-full"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {translations[language].addProduct}
              </motion.button>
            </Link>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 bg-rose-100/90 rounded-2xl shadow-lg border border-rose-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setFullScreenGraph("orders")}
          >
            <h3 className="font-bold text-xl text-rose-800">{translations[language].ordersGraph}</h3>
            <div className="mt-3 h-40">
              <Bar data={ordersData} options={chartOptions} />
            </div>
          </motion.div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <motion.div
            variants={itemVariants}
            className="p-6 bg-teal-100/90 rounded-2xl shadow-lg border border-teal-200 hover:shadow-xl hover:scale-105 transition-all duration-300"
          >
            <h3 className="font-bold text-xl text-teal-800">{translations[language].yourProducts}</h3>
            <div className="grid grid-cols-2 gap-3 mt-3">
              {selectedProducts.map((product) => (
                <motion.img
                  key={product.id}
                  src={product.image}
                  alt={product.name}
                  className="w-full h-28 object-cover rounded-xl border border-teal-300 shadow-sm"
                  whileHover={{ scale: 1.1 }}
                  transition={{ duration: 0.3 }}
                />
              ))}
            </div>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="p-6 bg-cyan-100/90 rounded-2xl shadow-lg border border-cyan-200 hover:shadow-xl hover:scale-105 transition-all duration-300 cursor-pointer"
            onClick={() => setFullScreenGraph("analytics")}
          >
            <h3 className="font-bold text-xl text-cyan-800">{translations[language].analytics}</h3>
            <div className="mt-3 h-44">
              <Pie data={analyticsData} options={pieOptions} />
            </div>
          </motion.div>

          {/* News Container */}
          <motion.div
            variants={itemVariants}
            className="p-6 bg-gradient-to-r from-emerald-100 to-teal-100 rounded-2xl shadow-lg border border-emerald-200 hover:shadow-xl transition-all duration-300"
          >
            <h3 className="font-bold text-xl text-emerald-800 mb-3">{translations[language].farmingNews}</h3>
            {newsData ? (
              <>
                <p className="text-emerald-900 mb-4">{newsData.title}</p>
                {youtubeVideo && (
                  <div className="flex flex-col items-center">
                    <p className="font-semibold text-teal-800 mb-2">Recommended Video</p>
                    <a href={youtubeVideo.url} target="_blank" rel="noopener noreferrer">
                      <motion.img
                        src={youtubeVideo.thumbnail}
                        alt={youtubeVideo.title}
                        className="w-48 h-28 object-cover rounded-xl shadow-md"
                        whileHover={{ scale: 1.05 }}
                        transition={{ duration: 0.3 }}
                      />
                      <p className="text-sm text-teal-900 mt-2 text-center">{youtubeVideo.title}</p>
                    </a>
                  </div>
                )}
              </>
            ) : (
              <p className="text-emerald-900">Loading news...</p>
            )}
          </motion.div>

          {/* Buttons */}
          <div className="flex flex-col space-y-3">
            {[
              { text: "addProduct", color: "emerald" },
              { text: "withdrawProduct", color: "orange" },
              { text: "feedback", color: "purple" },
              { text: "newMessage", color: "indigo" },
            ].map((btn) => (
              <motion.button
                key={btn.text}
                className={`w-full h-16 px-6 py-4 bg-${btn.color}-600 text-white rounded-xl hover:bg-${btn.color}-700 shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 font-medium`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => alert(translations[language][btn.text])}
              >
                {translations[language][btn.text]}
              </motion.button>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;