import { useState } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../utilities/supabase";

import GenericNav from "../components/GenericNav";
import Button from "../components/Button";

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
            <div className="main-container">
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <Button text="Login" className="main-btn btn" type="submit" />

                    {
                        errorMessage && <p>{errorMessage}</p>
                    }
                </form>
                <p>Don't have an account? <Link to="/signup">Sign up here.</Link></p>
            </div>
        </>
    )

}