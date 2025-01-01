import React, { useState, useEffect } from "react";
import { ref, get } from "firebase/database";
import { database } from "../firebaseconfig";
import "bootstrap/dist/css/bootstrap.min.css";

const DeliveryHistory = () => {
    const [dates, setDates] = useState([]);
    const [selectedDate, setSelectedDate] = useState("");
    const [records, setRecords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDates = async () => {
            try {
                const datesRef = ref(database, "dailyCheck/");
                const snapshot = await get(datesRef);
                if (snapshot.exists()) {
                    setDates(Object.keys(snapshot.val()));
                } else {
                    setError("No records found.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDates();
    }, []);

    const handleDateChange = async (e) => {
        const date = e.target.value;
        setSelectedDate(date);

        if (date) {
            try {
                setLoading(true);
                const recordsRef = ref(database, `dailyCheck/${date}/`);
                const snapshot = await get(recordsRef);
                if (snapshot.exists()) {
                    setRecords(Object.values(snapshot.val()));
                } else {
                    setError("No records found for this date.");
                    setRecords([]);
                }
            } catch (error) {
                setError(error.message);
                setRecords([]);
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="container mt-5">
            <h2>View Delivery or Daily Check History</h2>

            {loading && <p>Loading...</p>}
            {error && <p className="text-danger">Error: {error}</p>}

            <div className="mb-3">
                <label htmlFor="dateDropdown" className="form-label">
                    Select a Date:
                </label>
                <select
                    id="dateDropdown"
                    className="form-select"
                    value={selectedDate}
                    onChange={handleDateChange}
                >
                    <option value="">-- Select Date --</option>
                    {dates.map((date, index) => (
                        <option key={index} value={date}>
                            {date}
                        </option>
                    ))}
                </select>
            </div>

            {selectedDate && records.length > 0 && (
                <div>
                    <h4>Records for {selectedDate}</h4>
                    <table className="table table-striped">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Customer Name</th>
                                <th>Milk Quantity (ml)</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {records.map((record, index) => (
                                <tr key={index}>
                                    <td>{index + 1}</td>
                                    <td>{record.customerName}</td>
                                    <td>{record.milkQuantity}</td>
                                    <td>{record.status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {selectedDate && records.length === 0 && !loading && (
                <p>No records available for the selected date.</p>
            )}
        </div>
    );
};

export default DeliveryHistory;
