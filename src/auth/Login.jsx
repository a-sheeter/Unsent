import { useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../utilities/supabase";

import GenericNav from "../components/GenericNav";
import Button from "../components/Button";

import "../styles/login-signup.css";

export default function Login() {

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    async function handleLogin(e) {
        e.preventDefault();

        const { data, error } =
            await supabase.auth.signInWithPassword({
                email,
                password
            });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        console.log("Logged in:", data.user);

        //redirect user
        window.location.href = "/";
    }

    return (
        <>
            <GenericNav />
            <div className="main-container center-screen login-signup">
                <form onSubmit={handleLogin}>
                    <label htmlFor="">Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button text="Login" className="main-btn btn" type="submit" />

                    {
                        errorMessage && <p>{errorMessage}</p>
                    }
                </form>
                <p>Don't have an account? <Link to="/signup">Register Now</Link></p>
            </div>
        </>
    )

}