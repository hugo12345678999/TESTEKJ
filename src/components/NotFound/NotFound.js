import "./NotFound.css";
import React from "react";
import {NavLink} from "react-router-dom";
import * as links from "../../utils/links"
function NotFound() {
    return (
        <div className="NotFoundWrapper">
            <div className="NotFoundText">
                404 - Página Não Encontrada.
            </div>
            {/* <NavLink to={links.MAIN} className="NotFoundGoHome">
                Voltar
            </NavLink> */}
        </div>
    )
}

export default NotFound;
