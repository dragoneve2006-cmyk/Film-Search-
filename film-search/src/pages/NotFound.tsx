//Pagina 404 - Not Found
import {Link} from "react-router-dom";
import FuzzyText  from "../components/FuzzyText";

export const NotFound =  () => {
    return(
        <div className="not-found">
            <div className="not-found-content">
                <FuzzyText
                    fontSize={60}
                    fontWeight={900}
                    baseIntensity={0.3}
                    hoverIntensity={0.8}
                    glitchMode={true}
                    glitchInterval={3000}
                    glitchDuration={300}
                    enableHover={true}
                    clickEffect={true}
                    direction="both"
                    gradient={['#3b82f6', '#2563eb', '#1e40af']}
                    letterSpacing={10}
                    className="mb-8"
                >
                    404
                </FuzzyText>
                    <h2>Pagina non trovata</h2>
                    <p>La pagina che cerchi non esiste 😭</p>
                        <Link to="/" className="btn btn-primary">
                    Torna alla HOME
                </Link>
            </div>
        </div>
    );
};