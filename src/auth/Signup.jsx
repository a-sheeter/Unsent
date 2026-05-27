import { useState } from "react";
import { supabase } from "../../utilities/supabase";
import { Link } from "react-router-dom";

import Button from "../components/Button";
import GenericNav from "../components/GenericNav";

import "../styles/login-signup.css";

export default function Signup() {
    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [successMessage, setSuccessMessage] = useState("");

    async function handleSignup(e) {
        e.preventDefault();

        // Create authenticated user
        const { data, error } = await supabase.auth.signUp({
            email,
            password
        });

        if (error) {
            console.log("Auth Error:", error.message);
            return;
        }

        const user = data.user;

        // Insert into profiles table
        if (user) {
            const { error: profileError } = await supabase
                .from("profiles")
                .insert([
                    {
                        id: user.id,
                        name: name,
                        username: username
                    }
                ]);

                if (profileError) {
                    console.log("Profile Error:", profileError.message);
                    return;
                }
        }
        console.log("User created successfully.")

        setName("");
        setUsername("");
        setEmail("");
        setPassword("");

        setSuccessMessage("Account created successfully! You can now login.");
    }

    return (
    <>
        <GenericNav/>
        <div className="main-container center-screen login-signup">
            <form onSubmit={handleSignup}>
                <label htmlFor="name">Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                <label htmlFor="username">Username</label>
                <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />
                <label htmlFor="email">Email</label>
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
                
                <Button className="main-btn btn" text="Create Account" type="submit"/>
            </form>
            <p>Already have an account? <Link to="/login">Login Now</Link></p>

            {
                successMessage && (
                    <div>
                        <p>{successMessage}</p>
                        <a href="/login">Login here</a>
                    </div>
                )
            }
        </div>
    </>
)
}

