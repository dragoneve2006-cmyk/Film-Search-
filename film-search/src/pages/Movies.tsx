//Pagina per la visione di tutti a film disponibili

import {useState} from 'react';
import {useQuery} from '@tanstack/react-query';
import {moviesApi} from '../api/movies';
import {MovieCard} from '../components/MovieCard';
import {Loader} from '../components/Loader';
import {ErrorMessage} from '../components/ErrorMessage';

export const Movies = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [page, setPage] = useState(1);
    const [activeTab, setActiveTab] = useState<'popular' | 'trending'>('popular');

    const {data, isLoading, error} = useQuery({
        queryKey: ['movies', activeTab, page, searchQuery],
        queryFn: async () => {
            if(searchQuery.trim()){
                return moviesApi.searchMovies(searchQuery, page);
            }
            return activeTab === 'popular'
            ? moviesApi.getPopularMovies(page)
            : moviesApi.getTrendingMovies(page);
        },
    });

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setPage(1);
    };

    const handleClearSearch = () => {
        setSearchQuery('');
        setPage(1);
    };

    return(
        <div className="movies-container">
            <div className="movies-header">
                <h1>🎬 Esplora Film</h1>

                <form onSubmit={handleSearch} className="search-form">
                    <input
                        type="text"
                        placeholder="Cerca un film..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="search-input"
                    />
                    <button type="submit" className="btn btn-primary">
                        Cerca
                    </button>
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={handleClearSearch}
                            className="btn btn-secondary"
                        >
                            Cancella
                        </button>
                    )}
                </form>
            </div>

            {isLoading && <Loader />}

            {error && <ErrorMessage message="Errore nel caricamento dei film. Riprova più tardi." />}
            
            {data && (
                <>
                    <div className="movies-grid">
                        {data.results.map((movie) => (
                            <MovieCard key={movie.id} movie={movie} />
                        ))}
                    </div>
                    
                    {data.results.length === 0 && (
                        <div className="no-results">
                            <p>Nussun film trovato 🥲</p>
                        </div>
                    )}

                    {data.total_pages > 1 && (
                        <div className="pagination">
                            <button
                                onClick={() => setPage((p) => Math.max(1, p -1))}
                                disabled={page === 1}
                                className="btn btn-secondary"
                            >
                                🔙 Precedente
                            </button>
                            <span className="page-info">
                                Pagina {page} di {data.total_pages}
                            </span>
                            <button
                                onClick={() => setPage((p) => Math.min(data.total_pages, p +1))}
                                disabled={page === data.total_pages}
                                className="btn btn-secondary"
                            >
                                Successivo 🔜
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};