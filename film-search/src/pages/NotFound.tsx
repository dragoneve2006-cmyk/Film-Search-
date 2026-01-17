//Pagina 404 - Not Found
import {Link} from "react-router-dom";

export const NotFound =  () => {
    return(
        <div className="not-found">
            <div className="not-found-content">
                <h1 className="not-found-title">404</h1>
                <h2>Pagina non trovata</h2>
                <p>La pagina che cerchi non esiste 😭</p>
                <Link to="/" className="btn btn-primary">
                    Torna alla HOME
                </Link>
            </div>
        </div>
    );
};