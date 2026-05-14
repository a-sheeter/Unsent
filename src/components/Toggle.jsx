import "../styles/toggle.css";

export default function Toggle({ isOn, onToggle, disabled=false }) {
    return (
        <div
            className={`toggle ${isOn ? "on" : "off"} ${disabled ? "disabled" : ""}`}
            onClick={() => {
                if (!disabled) onToggle(!isOn);
            }}
            role="switch"
            aria-checked={isOn}
        >
            <div className="toggle-knob"/>

        </div>
    )
}