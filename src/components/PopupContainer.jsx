import "../styles/popup.css";
import icon from "../assets/unsent_icon.png";

export default function PopupContainer({ title, children, isClosed = "false" }) {

    return (
        <div className={`popup-background ${isClosed ? "close" : ""}`}>
            <div className="popup-container">
                <div className="popup-header">
                    <img width="45" src={icon} alt="logo" />
                    <h2 className="dark-blue-text">{title}</h2>
                </div>
                <div className="popup-body">
                    {children}
                </div>
            </div>
        </div>
    )
}