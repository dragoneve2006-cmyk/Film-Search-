//Pagina dei film preferti

import {Link} from "react-router-dom";
import {useFavorites} from "../hooks/useFavorites";
import {MovieCard} from "../components/MovieCard";

export const Favorites = () => {
    const {favorites} = useFavorites();

    return(
        <div className="favorites-container">
            <h1>❤️ I Miei Preferiti</h1>

            {favorites.length === 0 ? (
                <div className="empty-favorites">
                    <p className="empty-message">Non hai ancora aggiunto film ai preferiti ❤️</p>
                    <Link to="/movies" className="btn btn-primary">
                    Scopri Film
                    </Link>
                </div>
            ) : (
                <>
                    <p className="favorites-count">
                        Hai salvato {favorites.length} {favorites.length === 1 ? 'film' : 'film'}
                    </p>
                    <div className="movies-grid">
                        {favorites.map((movie) => (
                            <MovieCard
                            key={movie.id}
                            movie={movie}
                            showWatchlistActions={false}
                            currentList="favorites"
                        />
                        ))};
                    </div>
                </>
            )};
        </div>
    );
};


