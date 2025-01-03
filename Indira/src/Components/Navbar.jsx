import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

const Navbar = () => {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
            <div className="container">
                <Link className="navbar-brand" to="/">
                    MilkyWay App
                </Link>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                    aria-controls="navbarNav"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link" to="/CustomerList">
                                Customer List
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/DeliveryHistory">
                                Delivery History
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/DailyCheck">
                                Daily Check
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/AddCustomer">
                               Add Customers
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/BillingPage">
                                Billing
                            </Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/login">

                                Login
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
