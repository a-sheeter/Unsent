import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";
import PopupContainer from "../components/PopupContainer";

export default function Profile() {

    /* --- State --- */
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");

    const [isPopupClosed, setIsPopupClosed] = useState(true);

    const [errorMessage, setErrorMessage] = useState("");

    /* --- Effects ---*/
    useEffect(() => {
        document.title = "Profile";
    }, []);

    useEffect(() => {
        loadProfile();
    }, []);

    /* --- Popup handlers --- */
    function resetForm() {
        setName("");
        setUsername("");
    }

    function handleClosePopup() {
        resetForm();
        setErrorMessage("");
        setIsPopupClosed(true);
    }

    /* --- Edit Profile Handler --- */
    function handleEditProfile() {
        if (!profile) return;

        setErrorMessage("");
        setName(profile.name);
        setUsername(profile.username);

        setIsPopupClosed(false);
    }

    async function updateProfile(e) {
        e.preventDefault();

        setErrorMessage("");

        const { data: userData } = await supabase.auth.getUser();

        const user = userData?.user;

        if (!user) {
            setErrorMessage("Unable to update profile.");
            return;
        }

        if (!name.trim()) {
            setErrorMessage("Name is required.");
            return;
        }

        const { error } = await supabase
            .from("profiles")
            .update({
                name: name.trim(),
                username: username.trim()
            })
            .eq("id", user.id);

        if (error) {
            setErrorMessage(error.message);
            return;
        }

        await loadProfile();

        resetForm();
        setIsPopupClosed(true);
    }

    /* --- Load Profile Data --- */
    async function loadProfile() {
        setLoading(true);

        try {
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
        } finally {
            setLoading(false);
        }
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
        <>
            <PopupContainer title="Edit Profile" isClosed={isPopupClosed} handleClosePopup={handleClosePopup}>
                <form className="checkin-form" onSubmit={updateProfile}>
                    <div>
                        <label htmlFor="name">Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    {errorMessage && (
                        <div className="form-error">
                            {errorMessage}
                        </div>
                    )}
                    <div className="two-btns"><Button className="btn outline-btn" type="button" onClick={handleClosePopup}>Close</Button>
                        <Button className="btn secondary-btn" type="submit">Save Changes</Button></div>

                </form>
            </PopupContainer>
            <div className="main-container">
                <div className="flex-row space-between">
                    <h1 className="dark-blue-text">Profile</h1>
                    <Button type="button" className="btn secondary-btn" onClick={handleEditProfile}>Edit Profile</Button>
                </div>

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
        </>
    );
}