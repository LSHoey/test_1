import React from "react";
import "./NotFound.css";

function NotFound() {
    return (
        <div class="not-found-container d-flex align-items-center justify-content-center vh-100">
            <div class="text-center">
                <h1 class="display-1 fw-bold not-found-title">404</h1>
                <p class="fs-3">
                    <span class="text-danger">Opps!</span> Page not found.
                </p>
                <p class="lead">The page you're looking for doesn't exist.</p>
            </div>
        </div>
    );
}

export default NotFound;
