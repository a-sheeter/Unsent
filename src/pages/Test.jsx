import { supabase } from "../../utilities/supabase";

import "../styles/popup.css";

export default function Test() {

    async function getContacts() {

        // INSERT
        const { error: insertError } = await supabase
            .from("contacts")
            .insert([
                {
                    name: "Mom",
                    relationship: "Parent",
                    note: "Supportive"
                }
            ]);

        if (insertError) {
            console.log("Insert Error:", insertError);
            return;
        }

        // SELECT ALL
        const { data, error } = await supabase
            .from("contacts")
            .select("*");

        if (error) {
            console.log("Select Error:", error);
            return;
        }

        console.log(data);
    }

    return (
        <>
            <div className="main-container">
                <button onClick={getContacts}>
                    Get Contacts
                </button>
            </div>
        </>

    );
}