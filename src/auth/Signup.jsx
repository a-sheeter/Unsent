import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";
import GenericNav from "../components/GenericNav";

import "../styles/login-signup.css";

export default function Signup() {
    /* --- Effect --- */
    useEffect(() => {
        document.title = "Register | Unsent";
    }, []);

    /* --- State --- */
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");

    /* --- Helpers --- */
    function resetForm() {
        setName("");
        setUsername("");
        setEmail("");
        setPassword("");
    }

    /* --- Handlers --- */
    async function handleSignup(e) {
        e.preventDefault();

        setErrorMessage("");
        setSuccessMessage("");

        // Create authenticated user
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        const user = data.user;

        // Insert into profiles table
        if (user) {
            const { error: profileError } = await supabase
                .from("profiles")
                .insert({
                    id: user.id,
                    name,
                    username
                });

            if (profileError) {
                setErrorMessage(profileError.message);
                return;
            }
        }
        resetForm();

        setSuccessMessage("Account created successfully! You can now login.");
    }

    return (
        <>
            <GenericNav />
            <div className="main-container center-screen login-signup">
                <form onSubmit={handleSignup}>
                    <label htmlFor="name">Name</label>
                    <input
                        id="name"
                        type="text"
                        autoComplete="name"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        type="text"
                        autoComplete="username"
                        required
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
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

                    <Button className="main-btn btn" type="submit">Create Account</Button>
                </form>
                <p>Already have an account? <Link to="/login">Login Now</Link></p>

                {
                    successMessage && (
                        <div>
                            <p>{successMessage}</p>
                            <Link to="/login">Login here</Link>
                        </div>
                    )
                }

                {
                    errorMessage && <p className="form-error">{errorMessage}</p>
                }
            </div>
        </>
    )
}

