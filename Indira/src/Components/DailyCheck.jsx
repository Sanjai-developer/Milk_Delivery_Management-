import React, { useEffect, useState } from "react";
import { ref, set, get } from "firebase/database";
import { database } from "../firebaseconfig";
import "bootstrap/dist/css/bootstrap.min.css";

const DailyCheck = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dailyCheckData, setDailyCheckData] = useState({});
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCustomers = async () => {
            try {
                const dbRef = ref(database, "customers/");
                const snapshot = await get(dbRef);
                if (snapshot.exists()) {
                    const customersData = snapshot.val();
                    setCustomers(Object.values(customersData));
                    const initialDailyCheckData = {};
                    Object.keys(customersData).forEach((customerId) => {
                        const sanitizedKey = customersData[customerId].name.replace(/[.#$/[\]]/g, "_");
                        initialDailyCheckData[sanitizedKey] = {
                            milkQuantity: 500,
                            milkDelivered: false,
                        };
                    });
                    setDailyCheckData(initialDailyCheckData);
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

    const handleChange = (e, customerName) => {
        const sanitizedKey = customerName.replace(/[.#$/[\]]/g, "_");
        const { name, value, checked } = e.target;
        setDailyCheckData((prevData) => ({
            ...prevData,
            [sanitizedKey]: {
                ...prevData[sanitizedKey],
                [name]: name === "milkDelivered" ? checked : value,
            },
        }));
    };

    const handleQuantityChange = (customerName, increment) => {
        const sanitizedKey = customerName.replace(/[.#$/[\]]/g, "_");
        setDailyCheckData((prevData) => {
            const currentQuantity = parseInt(prevData[sanitizedKey]?.milkQuantity || 0, 10);
            const newQuantity = currentQuantity + increment;
            return {
                ...prevData,
                [sanitizedKey]: {
                    ...prevData[sanitizedKey],
                    milkQuantity: newQuantity > 0 ? newQuantity : 0,
                },
            };
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            const dateKey = new Date().toISOString().split("T")[0].replace(/[.#$/[\]]/g, "_");
            const dailyCheckRef = ref(database, `dailyCheck/${dateKey}`);

            const dataToStore = Object.entries(dailyCheckData).reduce((acc, [sanitizedKey, data]) => {
                if (data.milkDelivered) {
                    const customer = customers.find(c => c.name.replace(/[.#$/[\]]/g, "_") === sanitizedKey);
                    acc[customer.name] = {
                        milkQuantity: data.milkQuantity,
                        timestamp: new Date().toISOString(),
                        customerId: customer?.id || null,
                        customerName: customer.name,
                        customerEmail: customer?.email || null,
                    };

                    const historyRef = ref(database, `history/${customer.name}/${dateKey}`);
                    set(historyRef, {
                        milkQuantity: data.milkQuantity,
                        date: new Date().toISOString().split("T")[0],
                    });
                }
                return acc;
            }, {});

            await set(dailyCheckRef, dataToStore);

            alert("Daily check data submitted successfully!");
        } catch (error) {
            alert("Error submitting daily check: " + error.message);
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
            <h2>Daily Milk Delivery Check</h2>
            <form onSubmit={handleSubmit}>
                <div className="row">
                    {customers.map((customer) => {
                        const sanitizedKey = customer.name.replace(/[.#$/[\]]/g, "_");
                        return (
                            <div key={sanitizedKey} className="col-12 mb-4">
                                <div className="card">
                                    <div className="card-body">
                                        <div className="form-check mb-3">
                                            <input
                                                type="checkbox"
                                                className="form-check-input"
                                                id={`milkDelivered-${sanitizedKey}`}
                                                name="milkDelivered"
                                                checked={
                                                    dailyCheckData[sanitizedKey]?.milkDelivered || false
                                                }
                                                onChange={(e) => handleChange(e, customer.name)}
                                            />
                                            <label
                                                className="form-check-label"
                                                htmlFor={`milkDelivered-${sanitizedKey}`}
                                            >
                                                {customer.name}
                                            </label>
                                        </div>
                                        <div className="input-group">
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => handleQuantityChange(customer.name, -500)}
                                                disabled={
                                                    !dailyCheckData[sanitizedKey]?.milkDelivered
                                                }
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                className="form-control text-center"
                                                style={{ width: "80px" }}
                                                name="milkQuantity"
                                                value={
                                                    dailyCheckData[sanitizedKey]?.milkQuantity || 500
                                                }
                                                onChange={(e) => handleChange(e, customer.name)}
                                                disabled={
                                                    !dailyCheckData[sanitizedKey]?.milkDelivered
                                                }
                                            />
                                            <button
                                                type="button"
                                                className="btn btn-outline-secondary btn-sm"
                                                onClick={() => handleQuantityChange(customer.name, 500)}
                                                disabled={
                                                    !dailyCheckData[sanitizedKey]?.milkDelivered
                                                }
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
                <button type="submit" className="btn btn-success mt-3">
                    Submit Daily Check
                </button>
            </form>
        </div>
    );
};

export default DailyCheck;
