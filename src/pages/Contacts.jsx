// React
import { useState, useEffect } from "react";

// Hooks
import useContacts from "../hooks/useContacts";

// Components
import Button from "../components/Button";
import PopupContainer from "../components/PopupContainer";

// Utils
import { supabase } from "../../utilities/supabase";

export default function Contacts() {

    /* --- State --- */
    const {
        contacts,
        getContacts,
        deleteContact
    } = useContacts();

    const [editingContact, setEditingContact] = useState(null);

    const [name, setName] = useState("");
    const [relationship, setRelationship] = useState("");
    const [note, setNote] = useState("");

    const [formError, setFormError] = useState("");
    const [isPopupClosed, setIsPopupClosed] = useState(true);

    /* --- Effects --- */
    useEffect(() => {
        document.title = "Contacts";
    }, []);

    /* --- Popup handlers --- */
    function handleOpenPopup() {
        setIsPopupClosed(false)
    }

    function handleClosePopup() {
        resetForm();
        setIsPopupClosed(true);
    }

    /* --- Edit Contact Handler --- */
    function handleEditContact(contact) {
        setFormError("");

        setEditingContact(contact);

        setName(contact.name || "");
        setRelationship(contact.relationship || "");
        setNote(contact.note || "");

        setIsPopupClosed(false);
    }

    /* --- Contact Functions --- */
    function resetForm() {
        setName("");
        setRelationship("");
        setNote("");
        setFormError("");
        setEditingContact(null);
    }

    async function saveContact(e) {
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
            console.log(userError || "No authenticated user.");
            return;
        }

        const payload = {
            name: name.trim(),
            relationship: relationship.trim(),
            note: note.trim(),
        };

        let query = supabase.from("contacts");

        if (editingContact) {
            query = query.update(payload).eq("id", editingContact.id);
        } else {
            const avatar_colors = [
                "av-blue",
                "av-pink",
                "av-green",
                "av-orange"
            ]

            function getRandomColor() {
                return avatar_colors[Math.floor(Math.random() * avatar_colors.length)];
            }
            query = query.insert([
                {
                    ...payload,
                    user_id: user.id,
                    avatar_color: getRandomColor()
                }
            ]);
        }

        const { error } = await query;

        if (error) {
            setFormError(error.message);
            return;
        }

        await getContacts();
        resetForm();
        setIsPopupClosed(true);
    }

    return (
        <>
            {/* add contacts popup */}
            <PopupContainer title={editingContact ? "Edit Contact" : "Add New Contact"} isClosed={isPopupClosed} handleClosePopup={handleClosePopup}>
                <form className="checkin-form" onSubmit={saveContact}>
                    <div>
                        <label htmlFor="name">Full Name</label>
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
                        <label htmlFor="note">Optional Note</label>
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
                    <div className="two-btns"><Button className="btn outline-btn" type="button" onClick={handleClosePopup}>Close</Button>
                        <Button className="btn secondary-btn" type="submit">{editingContact ? "Save Changes" : "Add New Contact"}</Button></div>

                </form>
            </PopupContainer>

            {/* Main container */}
            <div className="main-container">
                <div className="flex-row space-between">
                    <h1 className="dark-blue-text">Contacts</h1>
                    <Button type="button" className="btn secondary-btn" onClick={handleOpenPopup}>Add New Contact</Button>
                </div>

                {contacts.length > 0 ? (
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Relationship Type</th>
                                <th>Last Written</th>
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

                                return (
                                    <tr key={contact.id}>
                                        <td data-label="Name">
                                            <div className="contact-name-wrapper">
                                                <div className={`avatar-circle ${contact.avatar_color}`}>
                                                    {initials}
                                                </div>
                                                <span>{contact.name}</span>
                                            </div>
                                        </td>
                                        <td data-label="Relationship Type">{contact.relationship}</td>
                                        <td data-label="Last Written">{contact.last_written}</td>
                                        <td data-label="Optional Note">{contact.note}</td>
                                        <td data-label="Actions">
                                            <div className="table-actions">
                                                <Button type="button" className="underline-btn"
                                                    onClick={() => handleEditContact(contact)}
                                                >Edit</Button>
                                                <Button type="button" onClick={() => deleteContact(contact.id)} className="underline-btn">Delete</Button>
                                            </div>
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        No contacts to show.
                    </div>
                )}

            </div>
        </>
    )
}