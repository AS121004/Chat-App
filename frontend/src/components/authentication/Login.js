import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router-dom";
import { ChatState } from "../../context/ChatProvider.js";

const Login = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);

    const history = useHistory();
    const { setUser } = ChatState();

    const submitHandler = async () => {
        setLoading(true);
        if (!email || !password) {
            alert("Please fill all the fields");
            setLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };

            const { data } = await axios.post(
                "/api/user/login",
                { email, password },
                config
            );

            alert("Login Successful");
            setUser(data);
            localStorage.setItem("userInfo", JSON.stringify(data));
            setLoading(false);
            history.push("/chats");
        } catch (error) {
            alert(`Error Occurred: ${error.response.data.message}`);
            setLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column gap-3">
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Your Email Address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-group">
                    <input
                        type={show ? "text" : "password"}
                        className="form-control"
                        id="password"
                        placeholder="Enter password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <button
                        className="btn btn-outline-secondary"
                        type="button"
                        onClick={handleClick}
                    >
                        {show ? "Hide" : "Show"}
                    </button>
                </div>
            </div>
            <button
                className="btn btn-primary w-100"
                style={{ marginTop: "15px" }}
                onClick={submitHandler}
                disabled={loading}
            >
                {loading ? "Logging in..." : "Login"}
            </button>
            <button
                className="btn btn-danger w-100"
                onClick={() => {
                    setEmail("guest@example.com");
                    setPassword("123456");
                }}
            >
                Get Guest User Credentials
            </button>
        </div>
    );
};

export default Login;
