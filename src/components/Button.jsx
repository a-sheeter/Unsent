import { useNavigate } from "react-router-dom";
import "../styles/button.css";

export default function Button({ type, url, className, text, onClick }) {
    const navigate = useNavigate();

    function handleClick(e) {
        if (onClick) onClick(e);
        if (url) navigate(url);
    }

    return (
        <button type={ type } onClick={handleClick} className={ className }>{ text }</button>
    )
}