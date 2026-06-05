import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { supabase } from "../../utilities/supabase";

import GenericNav from "../components/GenericNav";
import Button from "../components/Button";

import "../styles/login-signup.css";

export default function Login() {
    const navigate = useNavigate();

    /* --- State --- */
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    /* --- Handlers --- */
    async function handleLogin(e) {
        e.preventDefault();

        setErrorMessage("");

        const { error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        //redirect user
        navigate("/");
    }

    /* --- Render --- */
    return (
        <>
            <GenericNav />
            <div className="main-container center-screen login-signup">
                <form onSubmit={handleLogin}>
                    <label htmlFor="email">Email</label>
                    <input
                        id="email"
                        type="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        id="password"
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button className="main-btn btn" type="submit">Login</Button>

                    {
                        errorMessage && <p>{errorMessage}</p>
                    }
                </form>
                <p>Don't have an account? <Link to="/signup">Register Now</Link></p>
            </div>
        </>
    )

}