import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";

import "../styles/table.css";

export default function Contacts() {

    const [contacts, setContacts] = useState([]);

    const [name, setName] = useState("");
    const [relationship, setRelationship] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        getContacts();
    }, []);

    async function getContacts() {

        const {
            data: {user}
        } = await supabase.auth.getUser();

        if (!user) return;

        const { data, error } = await supabase
            .from("contacts")
            .select("*")
            .eq("user_id", user.id)
            .order("id", {ascending: false});
        
            if (error) {
                console.log(error)
            } else{
                console.log(data);
                setContacts(data);
            }

    }

    async function addContact(e) {

        e.preventDefault();

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
                    name: name,
                    relationship: relationship,
                    note: note
                }
            ])
            .select();
        if (error) {
            console.log(error)
        } else {
            setName("");
            setRelationship("");
            setNote("");

            getContacts();
        }
    }

    return (
        <div className="main-container">
            <div className="flex-row space-between">
                <h1 className="dark-blue-text">Contacts</h1>
            </div>

            <form onSubmit={addContact}>
                <input
                    type="text"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Relationship"
                    value={relationship}
                    onChange={(e) => setRelationship(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                />
                <Button text="Add New Contact" className="btn secondary-btn" type="submit" />
            </form>

            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Relationship</th>
                        <th>Last written</th>
                        <th>Optional Note</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact) => (
                        <tr key={contact.id}>
                            <td>{contact.name}</td>
                            <td>{contact.relationship}</td>
                            <td>{contact.last_written}</td>
                            <td>{contact.note}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}