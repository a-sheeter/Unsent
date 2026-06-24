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
                <p>Some things need to be said, but not necessarily sent.
                    <br></br>
                        Unsent is a private space for writing messages you'll never send. Whether you're processing anger, grief, disappointment, love, or unresolved conversations, Unsent helps you put thoughts into words without the pressure, consequences, or permanence of real-world communication. Write freely, reflect on what you're feeling, and release what you're carrying—knowing your words stay yours.</p>

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