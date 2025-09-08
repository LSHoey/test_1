import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../actions/userActions";
import "./Register.css";
import { NotificationContainer, NotificationManager } from 'react-notifications';
import 'react-notifications/lib/notifications.css';

function Register() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loginMessage, setLoginMessage] = useState("");
    const errorMessage = useSelector(state => state.user?.error);

    const newLogin = async () => {
        if (name?.length === 0 || email?.length === 0 || password?.length === 0) {
            return setLoginMessage("Please fill in all fields");
        }
        setLoginMessage("");
        const result = await dispatch(registerUser({ name, email, password }));
        if (result && result.status === 200) {
            navigate("/login");
        } else {
            return NotificationManager.error('Please log in to view products.', 'Error', 5000);
        }
    };

    return (
        <div className="container-fluid outsideContainer">
            <div className="logInContainer">
                <h1>Register </h1>
                <hr />
                <p className="errorMessage" style={{ height: "10px" }}>
                    {loginMessage || errorMessage}
                </p>
                <input
                    className="logInInput"
                    type="text"
                    onChange={(e) => {
                        setName(e.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            newLogin();
                        }
                    }}
                    name="name"
                    placeholder="Name"
                />
                <input
                    className="logInInput"
                    type="email"
                    onChange={(e) => {
                        setEmail(e.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            newLogin();
                        }
                    }}
                    name="email"
                    placeholder="Email"
                />
                <input
                    className="logInInput"
                    type="password"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                    onKeyDown={(event) => {
                        if (event.key === "Enter") {
                            newLogin();
                        }
                    }}
                    name="password"
                    placeholder="password"
                />
                <button onClick={newLogin} className="logInButton">
                    Submit
                </button>
                <p>
                    Already have an account?
                    <a className="signUpAnchor" href="/login">
                        Log in
                    </a>
                </p>
            </div>
            <NotificationContainer />
        </div>
    );
}

export default Register;
