import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

export default function useContacts() {
    const [contacts, setContacts] = useState([]);

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
            console.log(error);
            return;
        }

        const sortedContacts = [...data].sort((a,b) => {

            const lastNameA = a.name.split(" ").slice(-1)[0].toLowerCase();
            const lastNameB = b.name.split(" ").slice(-1)[0].toLowerCase();

            return lastNameA.localeCompare(lastNameB);
        });

        setContacts(sortedContacts);
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
            return;
        }

        setContacts(prev => 
            prev.filter(contact => contact.id !== contactId)
        );
    }

    return {
        contacts, 
        getContacts,
        deleteContact
    };
}