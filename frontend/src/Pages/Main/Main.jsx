import React from 'react'
import ProductTable from '../ProductTable/ProductTable'
import { useNavigate } from "react-router-dom";

function Main() {
    const navigate = useNavigate();
    const guestMode = localStorage.getItem("token") == null;
    return (
        <div><div className="row p-5">
            <div className="col-md-12 text-end">
                {guestMode ?
                    <button
                        className="btn btn-primary me-2"
                        onClick={() => { navigate('/login') }}
                    >
                        Login
                    </button>
                    :
                    <button
                        className="btn btn-danger me-2"
                        onClick={() => { localStorage.removeItem("id"); navigate('/login'); }}
                    >
                        Logout
                    </button>
                }
            </div>
            <ProductTable />
        </div></div>
    )
}

export default Main