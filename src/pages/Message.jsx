// React
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

// Components
import Button from "../components/Button";
import Toggle from "../components/Toggle";
import PopupContainer from "../components/PopupContainer";
import CheckinForm from "../components/CheckinForm";

// Hooks
import useContacts from "../hooks/useContacts";
import useWritingPrompts from "../hooks/useWritingPrompts";

// Utils
import { supabase } from "../../utilities/supabase";

// Styles
import "../styles/message.css";

export default function Message() {
    const navigate = useNavigate();

    /* --- Effects --- */
    useEffect(() => {
        document.title = "Message";
    }, []);

    /* --- State ---*/
    /* Precheck */
    const [emotion, setEmotion] = useState("");
    const [checkinNote, setCheckinNote] = useState("");

    /* Contacts */
    const {
        contacts
    } = useContacts();

    /* Message */
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");

    /* Prompts */
    const {
        currentPrompt,
        getNewPrompt
    } = useWritingPrompts();

    const [showPrompts, setShowPrompts] = useState(true);

    /* Form Errors */
    const [formError, setFormError] = useState("");

    /* Popup */
    const [isPopupClosed, setIsPopupClosed] = useState(false);

    /* Submitting form */
    const [isSubmitting, setIsSubmitting] = useState(false);

    /* --- Handlers --- */
    function handleClosePopup() {
        setIsPopupClosed(true);
    }

    function handleCheckinSubmit(e) {
        e.preventDefault();
        setIsPopupClosed(true);
    }

    function handleSelectRecipient(e) {
        setFormError("");
        setRecipient(e.target.value);
    }

    async function handleMessageSubmit(e) {
        e.preventDefault();

        setFormError("");
        setIsSubmitting(true);

        try {
            /* Current Date */
            const date = new Date().toLocaleDateString("en-CA");

            /* Selected Contact */
            const selectedContact = contacts.find((contact) => contact.id === recipient);

            if (!selectedContact) {
                setFormError("Please select a recipient.");
                return;
            }

            const { id: recipientId, name: recipientName, avatar_color: avatarColor } = selectedContact;

            const {
                data: { user },
                error: userError
            } = await supabase.auth.getUser();

            if (userError || !user) {
                console.log(userError || "No authenticated user.");
                return;
            }

            const { error: archiveError } = await supabase
                .from("message_archive")
                .insert([
                    {
                        recipient_name: recipientName,
                        recipient_id: recipientId,
                        subject: subject?.trim() || "",
                        emotion: emotion?.trim() || "",
                        note: checkinNote?.trim() || "",
                        created_at: date,
                        recipient_avatar_color: avatarColor,
                        user_id: user.id
                    }
                ]);

            if (archiveError) {
                setFormError(archiveError.message);
                return;
            }

            const { error: contactError } = await supabase
                .from("contacts")
                .update({
                    last_written: date
                })
                .eq("id", selectedContact.id);

            if (contactError) {
                setFormError(contactError.message);
                return;
            }

            //redirect user
            navigate("/archive");
        } catch (error) {
            console.log(error);
        }
        finally {
            setIsSubmitting(false);
        }
    }

    /* --- Form Reset --- */
    function resetForm() {
        setRecipient("");
        setSubject("");
        setMessage("");
        setEmotion("");
        setCheckinNote("");
    }

    /* --- Render --- */
    return (
        <>
            {/* popup container */}
            <PopupContainer title="Emotion Check-In" isClosed={isPopupClosed} handleClosePopup={handleClosePopup}>
                <CheckinForm selectLabel="How are you feeling right now?" noteLabel="What made you want to write today?" handleSkip={handleClosePopup} handleSubmit={handleCheckinSubmit} emotion={emotion} setEmotion={setEmotion} note={checkinNote} setNote={setCheckinNote} />
            </PopupContainer>

            {/* main container */}
            <div className="main-container">
                <div className="form-container">
                    <div className="form-header">
                        New Message
                        <div className="toggle-container">
                            <p>Writing Prompts</p>
                            <Toggle isOn={showPrompts} onToggle={setShowPrompts} />
                        </div>
                    </div>
                    <form className="message-form" onSubmit={handleMessageSubmit}>
                        <div className="form-group">
                            <label htmlFor="recipient">To</label>
                            <select id="recipient" value={recipient} onChange={handleSelectRecipient}>
                                <option value=""></option>
                                {contacts.map((contact) => (
                                    <option key={contact.id} value={contact.id}>
                                        {contact.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="subject">Subject</label>
                            <input type="text" id="subject" value={subject} onChange={(e) => setSubject(e.target.value)} />
                        </div>
                        <div className="form-group">
                            {showPrompts && (
                                <div className="prompt-box">
                                    <p>{currentPrompt}</p>
                                    <button type="button" onClick={getNewPrompt}>
                                        <svg width="17" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640"><path fill="rgb(158, 158, 158)" d="M500.7 138.7L512 149.4L512 96C512 78.3 526.3 64 544 64C561.7 64 576 78.3 576 96L576 224C576 241.7 561.7 256 544 256L416 256C398.3 256 384 241.7 384 224C384 206.3 398.3 192 416 192L463.9 192L456.3 184.8C456.1 184.6 455.9 184.4 455.7 184.2C380.7 109.2 259.2 109.2 184.2 184.2C109.2 259.2 109.2 380.7 184.2 455.7C259.2 530.7 380.7 530.7 455.7 455.7C463.9 447.5 471.2 438.8 477.6 429.6C487.7 415.1 507.7 411.6 522.2 421.7C536.7 431.8 540.2 451.8 530.1 466.3C521.6 478.5 511.9 490.1 501 501C401 601 238.9 601 139 501C39.1 401 39 239 139 139C238.9 39.1 400.7 39 500.7 138.7z" /></svg> <p>Refresh</p>
                                    </button>
                                </div>
                            )
                            }
                            <textarea value={message} onChange={(e) => setMessage(e.target.value)}></textarea>
                        </div>
                        <div className="button-group">
                            <div className="form-error">{formError}</div>
                            <Button type="submit" className="btn main-btn" disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Send Message"}</Button>
                        </div>
                    </form>
                </div>
            </div>
        </>
    );
}