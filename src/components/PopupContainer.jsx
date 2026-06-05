import "../styles/popup.css";
import icon from "../assets/unsent_icon.png";

export default function PopupContainer({ title, children, isClosed, handleClosePopup }) {

    return (
        <div className={`popup-background ${isClosed ? "close" : ""}`} onClick={handleClosePopup}>
            <div className="popup-container" onClick={(e) => e.stopPropagation()}>
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