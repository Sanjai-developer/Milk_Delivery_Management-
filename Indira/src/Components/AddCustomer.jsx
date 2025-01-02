// src/components/AddCustomer.js
import React, { useState } from "react";
import { getDatabase, ref, set } from "firebase/database";
import { database } from "../firebaseconfig";
import "bootstrap/dist/css/bootstrap.min.css";  // Import Bootstrap CSS

const AddCustomer = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [milkQuantity, setMilkQuantity] = useState(0); // Default milk quantity

  const handleAddCustomer = async (e) => {
    e.preventDefault();
    const customerId = Date.now(); // Unique ID based on timestamp for simplicity
    const dbRef = ref(database, "customers/" + customerId);
    await set(dbRef, {
      name,
      phone,
      address,
      milkQuantity // Adding the milk quantity
    });
    alert("Customer added successfully!");
    window.location.reload(); // Refresh the page
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Add New Customer</h2>
      <form onSubmit={handleAddCustomer}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Enter name"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Enter phone number"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            placeholder="Enter address"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="milkQuantity">Default Milk Quantity</label>
          <input
            type="number"
            className="form-control"
            id="milkQuantity"
            value={milkQuantity}
            onChange={(e) => setMilkQuantity(e.target.value)}
            placeholder="Enter default milk quantity"
            required
          />
        </div>
        <button type="submit" className="btn btn-primary">Add Customer</button>
      </form>
    </div>
  );
};

export default AddCustomer;
