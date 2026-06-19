import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

import { supabase } from "../../utilities/supabase";

import Button from "../components/Button";

import logo from "../assets/unsent_v1.png";
import profileIcon from "../assets/circle-user-solid-full.svg";
import unsentIcon from "../assets/unsent_icon.png";

export default function NavBar() {

    /* --- State --- */
    const [menuOpen, setMenuOpen] = useState(false);
    const navigate = useNavigate();

    /* --- Helpers --- */
    function toggleMenu() {
        setMenuOpen((prev) => !prev);
    }

    function closeMenu() {
        setMenuOpen(false);
    }

    /* --- Handlers --- */
    async function handleLogout() {
        const { error } = await supabase.auth.signOut();

        if (error) {
            console.log(error);
        }

        navigate("/login");
    }

    /* --- Render --- */
    return (
        <nav className="nav">
            {/* Desktop Nav */}
            <div className="nav-div-width desktop-nav">
                <ul>
                    <li>
                        <Link to="/message">+ Message</Link>
                    </li>
                    <li>
                        <Link to="/contacts">Contacts</Link>
                    </li>
                    <li>
                        <Link to="/archive">Archive</Link>
                    </li>
                </ul>
            </div>

            { /* Logo */}
            <Link to="/"><img className="nav-logo" src={logo} alt="Unsent Project Logo" /></Link>

            {/* Profile */}
            <div className="nav-div-width justify-content-end desktop-nav">
                <Link to="/profile"><img width="40" src={profileIcon} alt="Profile Icon" /></Link>
                <Button type="button" className="underline-btn btn" onClick={handleLogout}>Log Out</Button>
            </div>

            {/* Mobile Nav */}
            <div className="mobile-nav">
                <button onClick={toggleMenu} className="hamburger-btn"
                    aria-label="Toggle menu"
                    aria-expanded={menuOpen}
                    aria-controls="mobile-menu"
                >
                    <svg width="30" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(30, 48, 80)" d="M96 160C96 142.3 110.3 128 128 128L512 128C529.7 128 544 142.3 544 160C544 177.7 529.7 192 512 192L128 192C110.3 192 96 177.7 96 160zM96 320C96 302.3 110.3 288 128 288L512 288C529.7 288 544 302.3 544 320C544 337.7 529.7 352 512 352L128 352C110.3 352 96 337.7 96 320zM544 480C544 497.7 529.7 512 512 512L128 512C110.3 512 96 497.7 96 480C96 462.3 110.3 448 128 448L512 448C529.7 448 544 462.3 544 480z" /></svg>
                </button>

                {/* Overlay */}
                {menuOpen && (
                    <div className="overlay" onClick={closeMenu}></div>
                )}

                {/* Mobile Menu */}
                <div id="mobile-menu" className={`mobile-menu ${menuOpen ? "open" : ""}`}>
                    <div id="mobile-nav-icon"><img width="40" src={unsentIcon} alt="Unsent Icon" /></div>
                    <Link to="/message" onClick={closeMenu}>+ Message</Link>
                    <Link to="/contacts" onClick={closeMenu}>Contacts</Link>
                    <Link to="/archive" onClick={closeMenu}>Archive</Link>
                    <Link to="/profile" onClick={closeMenu}>Profile</Link>
                    <Link to="/login" onClick={handleLogout}>Log Out</Link>
                </div>
            </div>
        </nav>
    );
}