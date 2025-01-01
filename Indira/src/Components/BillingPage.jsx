import React, { useEffect, useState } from "react";
import { db } from "../firebaseconfig"; // Ensure Firebase is correctly configured
import { ref, get, set, update } from "firebase/database";

const BillingPage = () => {
    const [customers, setCustomers] = useState([]);
    const [selectedMonth, setSelectedMonth] = useState("January2025");
    const [milkRate, setMilkRate] = useState(0);
    const [newRate, setNewRate] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                // Fetch customers
                const customerSnapshot = await get(ref(db, "customers"));
                if (customerSnapshot.exists()) {
                    const customerList = Object.entries(customerSnapshot.val()).map(([id, data]) => ({
                        id,
                        ...data,
                    }));
                    setCustomers(customerList);
                }

                // Fetch milk rate
                const rateSnapshot = await get(ref(db, "settings/milkRate"));
                if (rateSnapshot.exists()) {
                    setMilkRate(rateSnapshot.val().rate);
                } else {
                    // If no rate exists, set a default value
                    await set(ref(db, "settings/milkRate"), { rate: 50 });
                    setMilkRate(50);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();
    }, []);

    const handleUpdateRate = async () => {
        try {
            const rateValue = parseFloat(newRate);
            if (isNaN(rateValue) || rateValue <= 0) {
                alert("Please enter a valid rate!");
                return;
            }

            await update(ref(db, "settings/milkRate"), { rate: rateValue });
            setMilkRate(rateValue);
            setNewRate("");
            alert("Milk rate updated successfully!");
        } catch (error) {
            console.error("Error updating milk rate:", error);
        }
    };

    const handleGenerateBill = async (customerId, amount) => {
        try {
            await update(ref(db, `customers/${customerId}/billing/${selectedMonth}`), {
                amount,
                status: "Pending",
            });
            alert("Bill generated successfully!");
        } catch (error) {
            console.error("Error generating bill:", error);
        }
    };

    const handleMarkAsPaid = async (customerId, month) => {
        try {
            await update(ref(db, `customers/${customerId}/billing/${month}`), {
                status: "Paid",
            });
            alert("Bill marked as paid!");
        } catch (error) {
            console.error("Error marking bill as paid:", error);
        }
    };

    return (
        <div className="container mt-5">
            <h1 className="text-center mb-4">Billing Management</h1>

            {/* Milk Rate Section */}
            <div className="card mb-4">
                <div className="card-body">
                    <h5 className="card-title">Milk Rate</h5>
                    <p className="card-text">
                        Current Milk Rate: <strong>₹{milkRate}</strong> per liter
                    </p>
                    <div className="input-group">
                        <input
                            type="number"
                            className="form-control"
                            placeholder="Enter new rate"
                            value={newRate}
                            onChange={(e) => setNewRate(e.target.value)}
                        />
                        <button
                            className="btn btn-primary"
                            onClick={handleUpdateRate}
                        >
                            Update Rate
                        </button>
                    </div>
                </div>
            </div>

            {/* Billing Section */}
            <div className="card">
                <div className="card-header">
                    <h5>Select Month for Billing</h5>
                    <select
                        className="form-select"
                        value={selectedMonth}
                        onChange={(e) => setSelectedMonth(e.target.value)}
                    >
                        <option value="January2025">January 2025</option>
                        <option value="February2025">February 2025</option>
                        {/* Add more months as needed */}
                    </select>
                </div>
                <div className="card-body">
                    <table className="table table-striped">
                        <thead className="table-dark">
                            <tr>
                                <th scope="col">Customer Name</th>
                                <th scope="col">Amount</th>
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {customers.map((customer) => {
                                const billing = customer.billing?.[selectedMonth] || {};
                                return (
                                    <tr key={customer.id}>
                                        <td>{customer.name}</td>
                                        <td>
                                            {billing.amount
                                                ? `₹${billing.amount}`
                                                : "Not Generated"}
                                        </td>
                                        <td>{billing.status || "N/A"}</td>
                                        <td>
                                            {!billing.amount && (
                                                <button
                                                    className="btn btn-primary btn-sm"
                                                    onClick={() =>
                                                        handleGenerateBill(
                                                            customer.id,
                                                            milkRate * 5 // Example: 5 liters/day
                                                        )
                                                    }
                                                >
                                                    Generate Bill
                                                </button>
                                            )}
                                            {billing.status === "Pending" && (
                                                <button
                                                    className="btn btn-success btn-sm"
                                                    onClick={() =>
                                                        handleMarkAsPaid(
                                                            customer.id,
                                                            selectedMonth
                                                        )
                                                    }
                                                >
                                                    Mark as Paid
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default BillingPage;
