import { useNavigate } from "react-router-dom";
import "../styles/button.css";

export default function Button({
        type = "button",
        url,
        className = "",
        children,
        onClick,
        disabled = false,
    }) {
    const navigate = useNavigate();

    function handleClick(e) {
        if (onClick) onClick(e);
        if (url) navigate(url);
    }

    return (
        <button type={type} onClick={handleClick} className={className} disabled={disabled}>{children}</button>
    )
}