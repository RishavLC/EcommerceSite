import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
    const navigate = useNavigate();
    const { register } = useAuth();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            await register(name, email, password, passwordConfirmation);
            setMessage("Registration successful!");
            setTimeout(() => navigate("/"), 500);
        } catch (err) {
            setMessage(err.message || "Registration failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 380, margin: "80px auto", padding: 24 }}>
            <h3>Register Here</h3>

            <form onSubmit={handleRegister} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
                <input
                    type="text"
                    placeholder="Full Name"
                    value={name}
                    required
                    onChange={(e) => setName(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    required
                    onChange={(e) => setEmail(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    required
                    onChange={(e) => setPassword(e.target.value)}
                    style={inputStyle}
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={passwordConfirmation}
                    required
                    onChange={(e) => setPasswordConfirmation(e.target.value)}
                    style={inputStyle}
                />

                <button className="checkout-btn" disabled={loading} type="submit">
                    {loading ? "Registering…" : "Register"}
                </button>
            </form>

            <p style={{ color: message === "Registration successful!" ? "#10b981" : "#ef4444" }}>{message}</p>

            <p style={{ marginTop: 12 }}>
                Already have an account? <Link to="/login">Login</Link>
            </p>
        </div>
    );
}

const inputStyle = {
    padding: "10px 12px",
    borderRadius: 8,
    border: "1px solid var(--border)",
    fontSize: 14,
    fontFamily: "inherit",
};
