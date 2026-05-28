import { useState, useEffect } from "react";

export default function Archive() {
    /* set meta title */
    useEffect(() => {
        document.title = "Archive";
    }, []);

    return (
        <>
            <p>Hello</p>
        </>
    )
}