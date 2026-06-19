// React
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

// Utils
import { supabase } from "../../utilities/supabase";

// Components
import Button from "../components/Button";

export default function Archive() {
    /* --- Effects --- */
    useEffect(() => {
        document.title = "Archive";
    }, []);

    useEffect(() => {
        getArchive();
    }, []);

    /* --- State --- */
    const [messageArchive, setMessageArchive] = useState([]);

    async function getArchive() {
        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (!user || userError) {
            console.log("No authenticated user.")
        };

        const { data, error: archiveError } = await supabase
            .from("message_archive")
            .select("*")
            .eq("user_id", user.id)
            .order("exact_timestamp", { ascending: false });

        if (archiveError) {
            console.log(archiveError);
            return;
        }

        setMessageArchive(data);
    }

    async function deleteArchive(archiveId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this archive?"
        );

        if (!confirmed) return;

        const { error } = await supabase
            .from("message_archive")
            .delete()
            .eq("id", archiveId);

        if (error) {
            console.log(error);
            return;
        }

        setMessageArchive(prev => prev.filter(archive => archive.id !== archiveId))
    }

    return (
        <>
            <div className="main-container">
                <h1 className="dark-blue-text">Unsent Archive</h1>

                {messageArchive.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Recipient</th>
                                <th>Emotion</th>
                                <th>Subject</th>
                                <th>Date</th>
                                <th>Optional Note</th>
                                <th>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {messageArchive.map((message) => {

                                const initials = message.recipient_name
                                    ?.split(" ")
                                    .map(word => word[0])
                                    .join("")
                                    .toUpperCase() || "";

                                return (
                                    <tr key={message.id}>
                                        <td data-label="Recipient"><div className="contact-name-wrapper">
                                            <div className={`avatar-circle ${message.recipient_avatar_color}`}>{initials}</div> {message.recipient_name}</div></td>
                                        <td data-label="Emotion">{message.emotion}</td>
                                        <td data-label="Subject">{message.subject}</td>
                                        <td data-label="Date">{message.created_at}</td>
                                        <td data-label="Optional Note">{message.note}</td>
                                        <td data-label="Action">
                                            <div className="table-actions">
                                                <Button type="button" className="underline-btn" onClick={() => deleteArchive(message.id)}>Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        No messages to show currently. <Link to="/message">Write one here.</Link>
                        </div>
                )}

            </div>
        </>
    )
}