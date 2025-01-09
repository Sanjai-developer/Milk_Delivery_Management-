import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { ref, get } from "firebase/database";
import { database } from "../firebaseconfig";
import "bootstrap/dist/css/bootstrap.min.css";

const ViewHistory = () => {
    const { customerName } = useParams();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const sanitizedKey = customerName.replace(/[.#$/[\]]/g, "_");
                const historyRef = ref(database, `history/${sanitizedKey}/`);
                const snapshot = await get(historyRef);
                if (snapshot.exists()) {
                    setHistory(Object.values(snapshot.val()));
                } else {
                    setError("No history found for this customer.");
                }
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchHistory();
    }, [customerName]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

    return (
        <div className="container mt-5">
            <h2>Delivery History for {customerName}</h2>
            <table className="table table-striped">
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Date</th>
                        <th>Milk Quantity (ml)</th>
                    </tr>
                </thead>
                <tbody>
                    {history.map((entry, index) => (
                        <tr key={index}>
                            <td>{index + 1}</td>
                            <td>{entry.date}</td>
                            <td>{entry.milkQuantity}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ViewHistory;
