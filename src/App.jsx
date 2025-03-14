import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Dashboard from './Components/Dashboard.jsx'; // Renamed Home to Dashboard
import ProductSelection from './Components/ProductSelection.jsx';
import Home from './Components/Home.jsx';
import Payment from './Components/Payment.jsx';
import CustomerDashboard from './Components/CustomerDashboard.jsx';
import Login from './Components/Login.jsx';


function App() {
  return (
    <Router>
      <div className="App">
        {/* If you want a title, use a Helmet component or update index.html */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/get" element={<Dashboard />} />
          <Route path="/addpro" element={<CustomerDashboard />} />
          <Route path="/payment" element={<Payment />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;