import { useEffect } from "react";

import Button from "../components/Button";
import PopupContainer from "../components/PopupContainer";

export default function Index() {

    /* set meta title */
    useEffect(() => {
        document.title = "Unsent";
    }, []);

    /* begin export */
    return (
        <>
            <div className="main-container center-screen"><Button type="button" url="/message" className="btn main-btn">+ New Message</Button></div>
        </>
    );
}