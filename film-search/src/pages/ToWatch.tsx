//Pagina film da vedere
import {Link} from "react-router-dom";
import {useWatchlist} from "../hooks/useWatchlist";
import {MovieCard} from "../components/MovieCard";

export const ToWatch = () => {
    const {toWatch} = useWatchlist();

    return(
        <div className="favorites-container">
            <h1>📝 Da Vedere</h1>

            {toWatch.length === 0 ? (
                <div className="empty-favorites">
                    <p className="empty-message">Non hai ancora aggiunto film da vedere 🎬</p>
                    <Link to="/movies" className="btn btn-primary">
                    Scopri Film
                    </Link>
                </div>
            ) : (
                <>
                    <p className="favorites-count">
                        Hai {toWatch.length} {toWatch.length === 1 ? 'film' : 'film'} da vedere
                    </p>
                    <div className="movies-grid">
                        {toWatch.map((movie) => (
                            <MovieCard
                            key={movie.id}
                            movie={movie}
                            showWatchlistActions={true}
                            currentList="toWatch"
                        />
                        ))};
                    </div>
                </>
            )};
        </div>
    );
}