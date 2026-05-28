import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";

import editIcon from "../assets/pen-to-square-solid-full.svg";

import "../styles/table.css";
import "../styles/contacts.css";

export default function Contacts() {
    /* set meta title */
    useEffect(() => {
        document.title = "Contacts";
    }, []);

    const avatarColors = [
        "av-blue",
        "av-pink",
        "av-green",
        "av-orange"
    ]

    const [contacts, setContacts] = useState([]);

    const [name, setName] = useState("");
    const [relationship, setRelationship] = useState("");
    const [note, setNote] = useState("");

    useEffect(() => {
        getContacts();
    }, []);

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
        } else {
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
                        <th>Edit</th>
                    </tr>
                </thead>
                <tbody>
                    {contacts.map((contact, index) => {

                        const initials = contact.name
                            .split(" ")
                            .map(word => word[0])
                            .join("")
                            .toUpperCase();

                        const avatarClass = avatarColors[index % avatarColors.length];

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
                                <td><button><svg width="26" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(27, 45, 72)" d="M535.6 85.7C513.7 63.8 478.3 63.8 456.4 85.7L432 110.1L529.9 208L554.3 183.6C576.2 161.7 576.2 126.3 554.3 104.4L535.6 85.7zM236.4 305.7C230.3 311.8 225.6 319.3 222.9 327.6L193.3 416.4C190.4 425 192.7 434.5 199.1 441C205.5 447.5 215 449.7 223.7 446.8L312.5 417.2C320.7 414.5 328.2 409.8 334.4 403.7L496 241.9L398.1 144L236.4 305.7zM160 128C107 128 64 171 64 224L64 480C64 533 107 576 160 576L416 576C469 576 512 533 512 480L512 384C512 366.3 497.7 352 480 352C462.3 352 448 366.3 448 384L448 480C448 497.7 433.7 512 416 512L160 512C142.3 512 128 497.7 128 480L128 224C128 206.3 142.3 192 160 192L256 192C273.7 192 288 177.7 288 160C288 142.3 273.7 128 256 128L160 128z"/></svg></button></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    )
}