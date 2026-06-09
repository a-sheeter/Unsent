import { Navigate } from "react-router-dom";

export default function PublicRoute({ user, children }) {
        return user
            ? <Navigate to="/" />
            : children;
    }