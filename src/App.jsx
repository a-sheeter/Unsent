// React
import { useEffect, useState } from "react";

// Router
import { Routes, Route } from "react-router-dom";

// Services
import { supabase } from "../utilities/supabase";

// Auth
import Signup from "./auth/Signup";
import Login from "./auth/Login";
import ProtectedRoute from "./auth/ProtectedRoute";
import PublicRoute from "./auth/PublicRoute";

// Pages
import About from "./pages/About";
import Contacts from "./pages/Contacts";
import Archive from "./pages/Archive";
import Message from "./pages/Message";
import Profile from "./pages/Profile";
import Index from "./pages/Index";

// Components
import NavBar from "./components/NavBar";

export default function App() {

    /* --- Auth State --- */
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    /* --- Effects --- */
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

    /* --- Loading State --- */
    if (loading) {
        return <p>Loading...</p>;
    }

    /* --- Render --- */
    return (
        <>

            {/* Only show navbar when logged in */}
            {user && <NavBar />}

            <Routes>

                {/* Public Routes */}
                <Route
                    path="/about"
                    element={
                        <PublicRoute user={user}>
                            <About/>
                        </PublicRoute>
                    }
                />
                <Route
                    path="/signup"
                    element={
                        <PublicRoute user={user}>
                            <Signup/>
                        </PublicRoute>
                    }
                />

                <Route
                    path="/login"
                    element={
                        <PublicRoute user={user}>
                            <Login/>
                        </PublicRoute>
                    }
                />

                {/* Protected Routes */}
                <Route
                    path="/"
                    element={
                        <ProtectedRoute user={user}>
                            <Index/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/contacts"
                    element={
                        <ProtectedRoute user={user}>
                            <Contacts />
                        </ProtectedRoute>

                    }
                />

                <Route
                    path="/archive"
                    element={
                        <ProtectedRoute user={user}>
                            <Archive />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/message"
                    element={
                        <ProtectedRoute user={user}>
                            <Message/>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute user={user}>
                            <Profile/>
                        </ProtectedRoute>
                    }
                />

            </Routes>
        </>
    );
}