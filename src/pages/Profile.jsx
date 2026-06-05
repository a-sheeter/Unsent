import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

export default function Profile() {

    /* --- State --- */
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    /* --- Effects ---*/
    useEffect(() => {
        document.title = "Profile";
    }, []);

    useEffect(() => {
        loadProfile();
    }, []);

    async function loadProfile() {
        setLoading(true);

        const { data: userData, error: userError } = await supabase.auth.getUser();

        const user = userData?.user;

        if (userError || !user) {
            setErrorMessage("Unable to load profile.");
            setLoading(false);
            return;
        }

        const { data, error } = await supabase
            .from("profiles")
            .select("name, username")
            .eq("id", user.id)
            .single();

        if (error) {
            setErrorMessage("Unable to load profile.")
            setLoading(false);
            return;
        }

        setProfile(data);
        setLoading(false);
    }

    if (loading) {
        return (
            <div className="main-container">
                <h1 className="dark-blue-text">User Profile</h1>
                <p className="gray-text">Loading...</p>
            </div>
        );
    }

    /* --- Render --- */
    return (
        <div className="main-container">
            <h1 className="dark-blue-text">User Profile</h1>

            <p className="gray-text">Name</p>
            <p>{profile?.name}</p>

            <p className="gray-text">Username</p>
            <p>{profile?.username}</p>

            <p className="gray-text">Password</p>
            <p>*********</p>

            {errorMessage && (
                <p className="form-error">{errorMessage}</p>
            )}
        </div>
    );
}