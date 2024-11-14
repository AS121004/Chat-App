import { useState, useEffect } from "react";
import { useHistory } from "react-router";
import Login from "../components/authentication/Login.js";
import Signup from "../components/authentication/Signup.js";

function Homepage() {
    const history = useHistory();
    const [activeTab, setActiveTab] = useState("login");

    useEffect(() => {
        const user = JSON.parse(localStorage.getItem("userInfo"));
        if (user) history.push("/chats");
    }, [history]);

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="container text-center mt-3">
            <div className="card p-3 mb-4">
                <h1 className="card-title">Chat-App</h1>
            </div>

            <div className="card p-3">
                <ul className="nav nav-tabs" role="tablist">
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "login" ? "active" : ""}`}
                            onClick={() => handleTabChange("login")}
                        >
                            Login
                        </button>
                    </li>
                    <li className="nav-item">
                        <button
                            className={`nav-link ${activeTab === "signup" ? "active" : ""}`}
                            onClick={() => handleTabChange("signup")}
                        >
                            Sign Up
                        </button>
                    </li>
                </ul>

                <div className="tab-content mt-3">
                    {activeTab === "login" && <Login />}
                    {activeTab === "signup" && <Signup />}
                </div>
            </div>
        </div>
    );
}

export default Homepage;
