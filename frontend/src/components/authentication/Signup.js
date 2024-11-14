import { useState } from "react";
import axios from "axios";
import { useHistory } from "react-router";
import { ChatState } from "../../context/ChatProvider.js";

const Signup = () => {
    const [show, setShow] = useState(false);
    const handleClick = () => setShow(!show);
    const history = useHistory();

    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [confirmpassword, setConfirmpassword] = useState();
    const [password, setPassword] = useState();
    const [pic, setPic] = useState();
    const [picLoading, setPicLoading] = useState(false);

    const submitHandler = async () => {
        setPicLoading(true);
        if (!name || !email || !password || !confirmpassword) {
            alert("Please fill all the fields");
            setPicLoading(false);
            return;
        }
        if (password !== confirmpassword) {
            alert("Passwords do not match");
            setPicLoading(false);
            return;
        }

        try {
            const config = {
                headers: {
                    "Content-type": "application/json",
                },
            };
            const { data } = await axios.post(
                "/api/user",
                {
                    name,
                    email,
                    password,
                    pic,
                },
                config
            );

            alert("Registration Successful");
            localStorage.setItem("userInfo", JSON.stringify(data));
            setPicLoading(false);
            history.push("/chats");
        } catch (error) {
            alert(`Error occurred: ${error.response.data.message}`);
            setPicLoading(false);
        }
    };

    const postDetails = (pics) => {
        setPicLoading(true);
        if (!pics) {
            alert("Please select an image");
            setPicLoading(false);
            return;
        }

        if (pics.type === "image/jpeg" || pics.type === "image/png") {
            const data = new FormData();
            data.append("file", pics);
            data.append("upload_preset", "chat-app");
            data.append("cloud_name", "piyushproj");
            fetch("https://api.cloudinary.com/v1_1/piyushproj/image/upload", {
                method: "post",
                body: data,
            })
                .then((res) => res.json())
                .then((data) => {
                    setPic(data.url.toString());
                    setPicLoading(false);
                })
                .catch((err) => {
                    alert("Error uploading image");
                    setPicLoading(false);
                });
        } else {
            alert("Please select an image file");
            setPicLoading(false);
        }
    };

    return (
        <div className="d-flex flex-column gap-3">
            <div className="form-group">
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    className="form-control"
                    id="name"
                    placeholder="Enter Your Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                />
            </div>
            <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <input
                    type="email"
                    className="form-control"
                    id="email"
                    placeholder="Enter Your Email Address"
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
                        placeholder="Enter Password"
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
            <div className="form-group">
                <label htmlFor="confirmpassword">Confirm Password</label>
                <div className="input-group">
                    <input
                        type={show ? "text" : "password"}
                        className="form-control"
                        id="confirmpassword"
                        placeholder="Confirm Password"
                        onChange={(e) => setConfirmpassword(e.target.value)}
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
            <div className="form-group">
                <label htmlFor="pic">Upload Your Picture</label>
                <input
                    type="file"
                    className="form-control"
                    id="pic"
                    accept="image/*"
                    onChange={(e) => postDetails(e.target.files[0])}
                />
            </div>
            <button
                className="btn btn-primary w-100"
                style={{ marginTop: 15 }}
                onClick={submitHandler}
                disabled={picLoading}
            >
                {picLoading ? "Signing up..." : "Sign Up"}
            </button>
        </div>
    );
};

export default Signup;
