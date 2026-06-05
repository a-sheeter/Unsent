import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";
import PopupContainer from "../components/PopupContainer";

import "../styles/table.css";
import "../styles/contacts.css";

const AVATAR_COLORS = [
    "av-blue",
    "av-pink",
    "av-green",
    "av-orange"
]

export default function Contacts() {

    /* --- State --- */
    const [contacts, setContacts] = useState([]);

    const [name, setName] = useState("");
    const [relationship, setRelationship] = useState("");
    const [note, setNote] = useState("");

    const [formError, setFormError] = useState("");
    const [isPopupClosed, setIsPopupClosed] = useState(true);

    /* --- Effects --- */
    useEffect(() => {
        document.title = "Contacts";
    }, []);

    useEffect(() => {
        getContacts();
    }, []);

    /* --- Popup handlers --- */
    function handleOpenPopup() {
        setIsPopupClosed(false)
    }

    function handleClosePopup() {
        setIsPopupClosed(true);
    }

    /* --- Contact functions --- */
    function resetForm() {
        setName("");
        setRelationship("");
        setNote("");
        setFormError("");
    }

    async function getContacts() {

        const {
            data: { user }
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .eq("user_id", user.id)
            .order("id", { ascending: false });

        if (error) {
            console.log(error)
            return;
        }

        const sortedContacts = data.sort((a, b) => {

            const lastNameA = a.name.split(" ").slice(-1)[0].toLowerCase();
            const lastNameB = b.name.split(" ").slice(-1)[0].toLowerCase();

            return lastNameA.localeCompare(lastNameB);
        })

        setContacts(sortedContacts);

    }

    async function addContact(e) {

        e.preventDefault();

        setFormError("");

        if (!name.trim()) {
            setFormError("Name is required.");
            return;
        }

        const {
            data: { user },
            error: userError
        } = await supabase.auth.getUser();

        if (userError || !user) {
            console.log("No authenticated user");
            return;
        }

        const { data, error } = await supabase
            .from("contacts")
            .insert([
                {
                    user_id: user.id,
                    name: name.trim(),
                    relationship: relationship.trim(),
                    note: note.trim()
                }
            ])
            .select();
        if (error) {
            console.log(error)
        } else {
            resetForm();
            getContacts();
        }
        setIsPopupClosed(true);
    }

    async function deleteContact(contactId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this contact?"
        );

        if (!confirmed) return;

        const { error } = await supabase
            .from("contacts")
            .delete()
            .eq("id", contactId);

        if (error) {
            console.log(error);
        } else {
            setContacts(prev => prev.filter(contact => contact.id !== contactId));
        }
    }

    return (
        <>
            {/* add contacts popup */}
            <PopupContainer title="Add New Contact" isClosed={isPopupClosed} handleClosePopup={handleClosePopup}>
                <form className="checkin-form">
                    <div>
                        <label htmlFor="Name">Full Name</label>
                        <input
                            id="name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="relationship">Relationship Type</label>
                        <input
                            id="relationship"
                            type="text"
                            placeholder="e.g., parent, friend"
                            value={relationship}
                            onChange={(e) => setRelationship(e.target.value)}
                        />
                    </div>

                    <div>
                        <label htmlFor="Note">Optional Note</label>
                        <input
                            id="note"
                            type="text"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                        />
                    </div>
                    {formError && (
                        <div className="form-error">
                            {formError}
                        </div>
                    )}
                    <div className="two-btns"><Button text="Close" className="btn outline-btn" type="button" onClick={handleClosePopup} />
                        <Button text="Add New Contact" className="btn secondary-btn" type="submit" onClick={addContact} /></div>

                </form>
            </PopupContainer>

            {/* Main container */}
            <div className="main-container">
                <div className="flex-row space-between">
                    <h1 className="dark-blue-text">Contacts</h1>
                    <Button type="button" text="Add New Contact" className="btn secondary-btn" onClick={handleOpenPopup} />
                </div>

                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Relationship Type</th>
                            <th>Last written</th>
                            <th>Optional Note</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contacts.map((contact, index) => {

                            const initials = contact.name
                                ?.split(" ")
                                .map(word => word[0])
                                .join("")
                                .toUpperCase() || "";

                            const avatarClass = AVATAR_COLORS[index % AVATAR_COLORS.length];

                            return (
                                <tr key={contact.id}>
                                    <td>
                                        <div className="contact-name-wrapper">
                                            <div className={`avatar-circle ${avatarClass}`}>
                                                {initials}
                                            </div>
                                            <span>{contact.name}</span>
                                        </div>
                                    </td>
                                    <td>{contact.relationship}</td>
                                    <td>{contact.last_written}</td>
                                    <td>{contact.note}</td>
                                    <td>
                                        <div className="table-actions">
                                            <Button text="Edit" type="button" className="underline-btn" />
                                            <Button text="Delete" type="button" onClick={() => deleteContact(contact.id)} className="underline-btn" />
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}
                    </tbody>
                </table>
            </div>
        </>
    )
}