import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

export default function Profile() {

    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        async function loadProfile() {
            setLoading(true);

            const { data: userData, error: userError } = await supabase.auth.getUser();

            const user = userData?.user;

            if (userError || !user) {
                console.log("No user found");
                setLoading(false);
                return;
            }

            const { data, error } = await supabase
                .from("profiles")
                .select("name, username")
                .eq("id", user.id)
                .single();

            if (error) {
                console.log(error);
                setLoading(false);
                return;
            }

            setProfile(data);
            setLoading(false);
        }

        loadProfile();

    }, []);

    if (loading) {
        return (
            <div className="main-container">
                <h1 className="dark-blue-text">User Profile</h1>
                <p className="gray-text">Loading...</p>
            </div>
        );
    }

    return (
        <div className="main-container">
            <h1 className="dark-blue-text">User Profile</h1>

            <p className="gray-text">Full name</p>
            <p>{profile?.name}</p>

            <p className="gray-text">Username</p>
            <p>{profile?.username}</p>

            <p className="gray-text">Password</p>
            <p>*********</p>
        </div>
    );
}