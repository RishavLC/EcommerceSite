import { useState } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Login() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage("");
        try {
            const user = await login(email, password);
            setMessage("Login successful!");
            const dest = location.state?.from?.pathname || (user.role === "admin" ? "/admin" : "/");
            setTimeout(() => navigate(dest, { replace: true }), 400);
        } catch (err) {
            setMessage(err.message || "Login failed.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: 380, margin: "80px auto", padding: 24 }}>
            <h3>Login Here</h3>

            <form onSubmit={handleLogin} style={{ display: "flex", flexDirection: "column", gap: 12, marginTop: 16 }}>
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

                <button className="checkout-btn" disabled={loading} type="submit">
                    {loading ? "Logging in…" : "Login"}
                </button>
            </form>

            <p style={{ marginTop: 12 }}>
                Don't have an account? <Link to="/register">Register</Link>
            </p>
            <p style={{ color: message === "Login successful!" ? "#10b981" : "#ef4444" }}>{message}</p>
            <p style={{ fontSize: 12, color: "var(--muted)", marginTop: 16 }}>
                Demo admin: admin@shopnest.test / password<br />
                Demo customer: test@example.com / password
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
