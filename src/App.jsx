import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";

import { supabase } from "../utilities/supabase";

import Contacts from "./pages/Contacts";
import Archive from "./pages/Archive";
import Message from "./pages/Message";
import Profile from "./pages/Profile";
import Test from "./pages/Test";
import Index from "./pages/Index";

import Signup from "./auth/Signup";
import Login from "./auth/Login";

import NavBar from "./components/NavBar";

export default function App() {

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        // Get existing session
        supabase.auth.getSession().then(({ data: { session } }) => {

            setUser(session?.user ?? null);
            setLoading(false);

        });

        // Listen for auth changes
        const {
            data: { subscription }
        } = supabase.auth.onAuthStateChange((_event, session) => {

            setUser(session?.user ?? null);

        });

        return () => subscription.unsubscribe();

    }, []);

    if (loading) {
        return <p>Loading...</p>;
    }

    return (
        <>

            {/* Only show navbar when logged in */}
            {user && <NavBar />}

            <Routes>

                {/* Public Routes */}
                <Route
                    path="/signup"
                    element={
                        user
                            ? <Navigate to="/" />
                            : <Signup />
                    }
                />

                <Route
                    path="/login"
                    element={
                        user
                            ? <Navigate to="/" />
                            : <Login />
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        user
                            ? <Index />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/contacts"
                    element={
                        user
                            ? <Contacts />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/archive"
                    element={
                        user
                            ? <Archive />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/message"
                    element={
                        user
                            ? <Message />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/profile"
                    element={
                        user
                            ? <Profile />
                            : <Navigate to="/login" />
                    }
                />

                <Route
                    path="/"
                    element={
                        user
                            ? <Index />
                            : <Navigate to="/login" />
                    }
                />

            </Routes>
        </>
    );
}