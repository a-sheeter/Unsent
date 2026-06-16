import "../styles/checkin-form.css";
import Button from "../components/Button";

const MOOD_OPTIONS = [
    "Angry",
    "Overwhelmed",
    "Anxious",
    "Sad",
    "Lonely",
    "Numb",
    "Confused",
    "Tired",
    "Calm",
    "Hopeful",
    "Happy",
    "Loved",
];

export default function CheckinForm({ selectLabel, noteLabel, handleSkip, handleSubmit, emotion, setEmotion, note, setNote }) {

    return (
        <form className="checkin-form" onSubmit={handleSubmit}>
            <div>
                <label htmlFor="mood-select">{selectLabel}</label>
                <select id="mood-select" value={emotion} onChange={(e) => setEmotion(e.target.value)}>
                    <option value="">Select an option</option>
                    {MOOD_OPTIONS.map((mood) => (
                        <option key={mood} value={mood}>
                            {mood}
                        </option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="mood-note">{noteLabel}</label>
                <textarea id="mood-note" rows="5" value={note} onChange={(e) => setNote(e.target.value)}></textarea>
            </div>
            <div className="checkin-form-button-container">
                <Button type="button" className="btn outline-btn" onClick={handleSkip}>Skip</Button>
                <Button type="submit" className="btn secondary-btn">Log Check-In</Button>
            </div>

        </form>
    )
}