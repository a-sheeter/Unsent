import "../styles/checkin-form.css";
import Button from "../components/Button";

export default function CheckinForm({ selectLabel, noteLabel, handleSkip }) {

    return (
        <form className="checkin-form">
            <div>
                <label htmlFor="pre-check-in">{selectLabel}</label>
                <select name="pre-check-in" id="pre-check-in">
                    <option value=""></option>
                    <option value="Angry">Angry</option>
                    <option value="Overwhelmed">Overwhelmed</option>
                    <option value="Anxious">Anxious</option>
                    <option value="Sad">Sad</option>
                    <option value="Lonely">Lonely</option>
                    <option value="Numb">Numb</option>
                    <option value="Confused">Confused</option>
                    <option value="Tired">Tired</option>
                    <option value="Calm">Calm</option>
                    <option value="Hopeful">Hopeful</option>
                    <option value="Happy">Happy</option>
                    <option value="Loved">Loved</option>
                </select>
            </div>

            <div>
                <label htmlFor="pre-check-in-note">{noteLabel}</label>
                <textarea rows="5"></textarea>
            </div>
            <div className="checkin-form-button-container">
                <Button type="button" className="btn outline-btn" onClick={handleSkip}>Skip</Button>
                <Button type="button" className="btn secondary-btn">Log Check-In</Button>
            </div>

        </form>
    )
}