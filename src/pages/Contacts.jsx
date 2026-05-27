import { useState, useEffect } from "react";
import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";

export default function Contacts() {
    return (
        <div className="main-container">
            <div className="flex-row space-between">
                <h1 className="dark-blue-text">Contacts</h1>
                <Button text="Add New Contact" className="btn secondary-btn"/>
            </div>
        </div>
    )
}