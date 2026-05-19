import { useEffect } from "react";
import { supabase } from "../../utilities/supabase";

import "../styles/popup.css";

export default function Test(){

    useEffect(() => {
        getContacts();
    }, []);

    async function getContacts() {
        const { data, error } = await supabase.from("contacts").select();

        if (error) {
            console.log(error);
            return;
        }

        console.table(data)
    }
    return (
        <p>Hello</p>
    )
}