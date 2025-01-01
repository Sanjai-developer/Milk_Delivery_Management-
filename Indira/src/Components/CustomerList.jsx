import React, { useState, useEffect } from "react";
import { ref, get, remove } from "firebase/database";
import { database } from "../firebaseconfig";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const dbRef = ref(database, "customers/");
        const snapshot = await get(dbRef);
        if (snapshot.exists()) {
          const customersData = snapshot.val();
          setCustomers(Object.values(customersData));
        } else {
          setError("No customers found");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleViewHistory = (customerName) => {
    navigate(`/ViewHistory/${customerName}`);
  };


  const handleEditCustomer = (id) => {
    const customer = customers.find((cust) => cust.id === id);
    if (customer) {
      navigate("/EditCustomer", { state: { customer } });
    } else {
      alert("Customer not found");
    }
  };

  const handleDeleteCustomer = async (id) => {
    try {
      const customerRef = ref(database, `customers/${id}`);
      await remove(customerRef);
      setCustomers(customers.filter(customer => customer.id !== id));
      alert("Customer deleted successfully!");
    } catch (error) {
      alert("Error deleting customer: " + error.message);
    }
  };


  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>Error: {error}</p>;
  }

  return (
    <div className="container mt-5">
      <h2>Customer List</h2>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>#</th>
            <th>Name</th>
            <th>Address</th>
            <th>Phone</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {customers.map((customer, index) => (
            <tr key={customer.id}>
              <td>{index + 1}</td>
              <td>{customer.name}</td>
              <td>{customer.address}</td>
              <td>{customer.phone}</td>
              <td>
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewHistory(customer.name)}
                >
                  View History
                </button>
                <button
                  className="btn btn-secondary btn-sm mx-2"
                  onClick={() => handleEditCustomer(customer.id)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => handleDeleteCustomer(customer.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomerList;
