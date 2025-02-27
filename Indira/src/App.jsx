// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./Components/Login";
import Register from "./Components/Register";
import CustomerList from "./Components/CustomerList";
import AddCustomer from "./Components/AddCustomer";
import EditCustomer from "./Components/EditCustomer";
import DailyCheck from "./Components/DailyCheck";
import ViewHistory from "./Components/ViewHistory";
import DeliveryHistory from "./Components/DeliveryHistory";
import Navbar from "./Components/NavBar";
import BillingPage from "./Components/BillingPage";

const App = () => {
  return (
    <Router>
        <Navbar />
        <div className="container mt-4">
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/CustomerList" element={<CustomerList />} />
        <Route path="/AddCustomer" element={<AddCustomer />} />
        <Route path="/EditCustomer" element={<EditCustomer />} />
        <Route path="/DailyCheck" element={<DailyCheck />} />\
        <Route path="/ViewHistory/:customerName" element={<ViewHistory />} />
        <Route path="/DeliveryHistory" element={<DeliveryHistory />} />
        <Route path="/BillingPage" element={<BillingPage />} />

      </Routes>
      </div>
    </Router>
  );
};

export default App;
