//Valutazione Film con chiamata POST (in locale)

import {useMovieRating} from "../hooks/useMovieRating";

interface MovieRaptingProps{
    movidId: number;
}

/**
 * valutazione Film
 * Con chiamata POST per inviare o rimuovere la valutazione
 * @param movidId - ID film 
 * @returns 
 */


export const MovieRating = ({movidId}: MovieRaptingProps) => {
    const{
        userRating,
        setuserRating,
        ratingMessage,
        isLoading,
        submitRating,
        removeRating,
        hasRated,
    } = useMovieRating(movidId);

    return(
        <div className="rating-section">
            <h3>⭐️ Valuta questo film</h3>
            <p className="rating-description">
                {hasRated ? 
                `Hai già valutato questo film con ${userRating} / 10. Puoi modificare o rimuovere la tua valutazione`:
                'Dai la tua valutazione personale del film da 1 a 10'
                }
            </p>

            <div className="rating-controls">
                <input
                    type="range"
                    min="0.5"
                    max="10"
                    step="0.5"
                    value={userRating}
                    onChange={(e) => setuserRating(parseFloat(e.target.value))}
                    className="rating-slider"
                    disabled={isLoading}
                    aria-label="Seleziona valutazione"
                />
                <span className="rating-value">⭐️ {userRating}/10</span>
            </div>

            <div className="rating-buttons">
                <button
                    onClick={submitRating}
                    className="btn btn-primary"
                    disabled={isLoading}
                    aria-label="Invia valutazione"
                >
                    {isLoading ? '⏳ Invio in corso...' : hasRated ? '🔄 Aggiorna Valutazione' : '📤 Invia Valutazione'}
                </button>

                <button
                    onClick={removeRating}
                    className="btn btn-secondary"
                    disabled={isLoading}
                    aria-label="Rimuovi valutazione"
                >
                    {isLoading ? '⏳ Rimozione in corso...' : '🗑️ Rimuovi Valutazione'}
                </button>
            </div>

            {ratingMessage && (
                <div className={`rating-message ${ratingMessage.includes('✅') ? 'success' : 'error'}`}
            >
                {ratingMessage}
            </div>
        )}
        </div>
    );
};