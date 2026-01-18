//Pagina film gia visti

import {Link} from "react-router-dom";
import {useWatchlist} from "../hooks/useWatchlist";
import {MovieCard} from "../components/MovieCard";

export const Watched = () =>{
    const {watched} = useWatchlist();

    return(
        <div className="favorites-container">
            <h1>✅ Già Visti</h1>

            {watched.length === 0 ? (
                <div className="empty-favorites">
                    <p className="empty-message">Non hai ancora segnato film come già visti 🍿</p>
                    <Link to="/movies" className="btn btn-primary">
                    Scopri Film
                    </Link>
                </div>
            ) : (
                <>
                    <p className="favorites-count">
                        Hai visto {watched.length} {watched.length === 1 ? 'film' : 'film'}
                    </p>
                    <div className="movies-grid">
                        {watched.map((movie) => (
                            <MovieCard
                            key={movie.id}
                            movie={movie}
                            showWatchlistActions={true}
                            currentList="watched"
                        />
                        ))};
                    </div>
                </>    
            )};
        </div>
    );
};