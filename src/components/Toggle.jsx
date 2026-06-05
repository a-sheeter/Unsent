import "../styles/toggle.css";

export default function Toggle({ isOn, onToggle, disabled=false }) {

    /* --- Handlers --- */
    function handleToggle() {
        if (!disabled) {
            onToggle(!isOn);
        }
    }

    /* --- Render --- */
    return (
        <button
            className={`toggle ${isOn ? "on" : "off"} ${disabled ? "disabled" : ""}`}
            onClick={handleToggle}
            role="switch"
            aria-checked={isOn}
        >
            <div className="toggle-knob"/>

        </button>
    )
}