import React, { useState, useEffect } from "react";
import { getDatabase, ref, get, set } from "firebase/database";
import { useParams, useLocation } from "react-router-dom";
import { database } from "../firebaseconfig";
import "bootstrap/dist/css/bootstrap.min.css";  // Import Bootstrap CSS

const EditCustomer = ({ customers }) => {
  const { id } = useParams(); // Get customer ID from URL
  const location = useLocation(); // Get location state
  const [customer, setCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    milkQuantity: 0
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (location.state && location.state.customer) {
      setCustomer(location.state.customer);
    } else {
      const customerData = customers.find((cust) => cust.id === id);
      if (customerData) {
        setCustomer(customerData);
      } else {
        setError("Customer not found");
      }
    }
  }, [id, customers, location.state]);

  const handleEditCustomer = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const customerRef = ref(database, "customers/" + id);
      await set(customerRef, {
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        address: customer.address,
        milkQuantity: customer.milkQuantity
      });
      setSuccess("Customer updated successfully!");
    } catch (error) {
      setError("Error updating customer data");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">Edit Customer</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleEditCustomer}>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            name="name"
            value={customer.name}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            className="form-control"
            id="email"
            name="email"
            value={customer.email}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="phone">Phone</label>
          <input
            type="text"
            className="form-control"
            id="phone"
            name="phone"
            value={customer.phone}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="address">Address</label>
          <input
            type="text"
            className="form-control"
            id="address"
            name="address"
            value={customer.address}
            onChange={handleInputChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="milkQuantity">Milk Quantity</label>
          <input
            type="number"
            className="form-control"
            id="milkQuantity"
            name="milkQuantity"
            value={customer.milkQuantity}
            onChange={handleInputChange}
            required
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? "Updating..." : "Update Customer"}
        </button>
      </form>
    </div>
  );
};

export default EditCustomer;