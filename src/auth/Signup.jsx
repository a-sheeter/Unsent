import { useState } from "react";
import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";

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
        <div className="main-container">
            <form onSubmit={handleSignup}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    />
                
                <input
                    type="text"
                    placeholder="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    />

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
                
                <Button className="main-btn btn" text="Create Account" type="submit"/>
            </form>

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

