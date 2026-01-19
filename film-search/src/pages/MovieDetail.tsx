//Pagina che viene visualizzata quando si clicca su un film specifico dalla lista dei film

import {useParams, useNavigate} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import {moviesApi, getImageUrl} from '../api/movies';
import {Loader} from '../components/Loader';
import {ErrorMessage} from '../components/ErrorMessage';
import {useFavorites} from '../hooks/useFavorites';
import {MovieRating} from '../components/MovieRating';

export const MovieDetail = () => {
    const {id} = useParams<{id: string}>();
    const navigate = useNavigate();
    const {favorites, addFavorite, removeFavorite} = useFavorites();

    const movieId = Number(id);
    const isFavorite = favorites.some((fav) => fav.id === movieId);

    const {data: movie, isLoading: movieLoading, error: movieError} = useQuery({
        queryKey: ['movie', movieId],
        queryFn: () => moviesApi.getMovieDetails(movieId),
        enabled: !!movieId,
    });

    const {data: cast, isLoading: castLoading} = useQuery({
        queryKey: ['credits', movieId],
        queryFn: () => moviesApi.getMovieCredits(movieId),
        enabled: !!movieId,
    });

    const handleFavoriteToggle = () => {
        if(!movie) 
            return;

        if(isFavorite){
            removeFavorite(movie.id);
        }else{
            addFavorite(movie);
        }
    }

    if(movieLoading) return <Loader />;
    if(movieError || !movie) return <ErrorMessage message="Film non trovato" />;

    return(
        <div className="movie-detail">
            <button onClick={() => navigate(-1)} className="btn btn-back">
                🔙 Indietro
            </button>

            <div className="movie-backdrop" 
                style={{backgroundImage: `url(${getImageUrl(movie.backdrop_path, 'original')})`
            }}
            >
                <div className="backdrop-overlay"></div>
            </div>

            <div className="movie-detail-content">
                <div className="movie-poster">
                    <img src={getImageUrl(movie.poster_path, 'w500')} alt={movie.title} />
                </div>

                <div className="movie-info-detail">
                    <h1>{movie.title}</h1>
                    {movie.tagline && <p className="tagline">{movie.tagline}</p>}

                    <div className="movie-meta">
                        <span className="rating">⭐️ {movie.vote_average.toFixed(1)}/10</span>
                        <span>({movie.vote_count} voti)</span>
                        <span>🗓️ {new Date(movie.release_date).getFullYear()}</span>
                        <span>⏱️ {movie.runtime} min</span>
                    </div>

                    <div className="genres">
                        {movie.genres.map((genre) => (
                            <span key={genre.id} className="genre-tag">
                                {genre.name}
                            </span>
                        ))}
                    </div>

                    <div className="overview">
                        <h3>Trama</h3>
                        <p>{movie.overview || 'Nessuna descrizione disponibile.'}</p>
                    </div>

                    <button
                        onClick={handleFavoriteToggle}
                        className={`btn ${isFavorite ? 'btn-danger' : 'btn-primary'}`}
                    >
                        {isFavorite ? '❤️ Rimuovi dai Preferiti' : '🤍 Aggiungi ai Preferiti'}
                    </button>

                    {/* Valutazione del film */}
                    <MovieRating movieId={movieId} />

                    <div className="additional-info">
                        <div className="info-item">
                            <strong>Status:</strong> {movie.status}
                        </div>
                        <div className="info-item">
                            <strong>Budget:</strong> ${movie.budget.toLocaleString()}
                        </div>
                        <div className="info-item">
                            <strong>Incasso:</strong> ${movie.revenue.toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>

            {castLoading ? (
                <Loader />
            ) : cast && cast.length > 0 ? (
                <div className="cast-section">
                    <h2>Cast Principale</h2>
                    <div className="cast-grid">
                        {cast.map((actor) => (
                            <div key={actor.id} className="cast-card">
                                <img
                                    src={getImageUrl(actor.profile_path, 'w200')}
                                    alt={actor.name}
                                />
                                <div className="cast-info">
                                    <p className="actor-name">{actor.name}</p>
                                    <p className="character-name">{actor.character}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            ) : null}
        </div>
    );
};
                                    
 
