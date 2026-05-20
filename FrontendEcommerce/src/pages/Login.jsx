import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
    const navigate = useNavigate();
    
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");

    const handleLogin = async () => {
        try {
            const response = await fetch("http://127.0.0.1:8000/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (response.ok) {
                // Save token in browser
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));

                setMessage("Login successful!");
                setTimeout(() => {
                    navigate("/");
                }, 1000);

                console.log("Token:", data.token);
                console.log("User:", data.user);
            } else {
                setMessage(data.message || "Login failed.");
                console.log(data);
            }
        } catch (error) {
            console.error(error);
            setMessage("Server error.");
        }
    };

    return (
        <div>
            <h3>Login Here</h3>

            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br /><br />

            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />

            <br /><br />

            <button onClick={handleLogin}>
                Login
            </button>
            <p>
                Don't have an account?<a href="/register">Register</a>
            </p>
            <p>{message}</p>
        </div>
    );
}