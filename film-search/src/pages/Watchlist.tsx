//Pagina della watchlist - PREFERITI - DA VEDERE - GIA VISTI

import {useState} from 'react';
import {Link} from 'react-router-dom';
import {useWatchlist} from '../hooks/useWatchlist';
import {useFavorites} from '../hooks/useFavorites';
import {MovieCard} from '../components/MovieCard';

type tabType = 'toWatch' | 'watched' | 'favorites';

export const Watchlist = () => {
    const [activeTab, setActiveTab] = useState<tabType>('toWatch');
    const {toWatch, watched} = useWatchlist();
    const {favorites} = useFavorites();

    const currentList = activeTab === 'toWatch' ? toWatch : activeTab === 'watched' ? watched : favorites;

    const tabConfig = {
        toWatch: {
            title: '📝 Da Vedere',
            icon: '🎬',
            emptyMessage: ' Non hai ancora aggiunto nessun film da vedere',
            color: '#3b82f6'
        },

        watched: {
            title: '✅ Già Visti',
            icon: '🍿',
            emptyMessage: ' Non hai ancora aggiunto nessun film visto',
            color: '#10b981'
        },

        favorites: {
            title: '❤️ Preferiti',
            icon: '⭐',
            emptyMessage: ' Non hai ancora aggiunto i tuoi film preferiti',
            color: '#f59e0b'
        }
    };

    return(
        <div className="watchlist-container">
            <div className="watchlist-header">
                <h1>📂 La Mia Watchlist</h1>
                <p className="watchlist-subtitle">Organizza i tuoi film da vedere, già visti e preferiti</p>
            </div>

            <div className="tabs-container">
                <button
                    className={`tab ${activeTab === 'toWatch' ? 'active' : ''}`}
                    onClick={() => setActiveTab('toWatch')}
                    style={{ '--tab-color': tabConfig.toWatch.color } as React.CSSProperties}
                >
                    <span className="tab-icon">{tabConfig.toWatch.icon}</span>
                    <span className="tab-title">Da Vedere</span>
                    <span className="tab-count">{toWatch.length}</span>
                </button>

                <button
                    className={`tab ${activeTab === 'watched' ? 'active' : ''}`}
                    onClick={() => setActiveTab('watched')}
                    style={{ '--tab-color': tabConfig.watched.color } as React.CSSProperties}
                >
                    <span className="tab-icon">{tabConfig.watched.icon}</span>
                    <span className="tab-title">Già Visti</span>
                    <span className="tab-count">{watched.length}</span>
                </button>

                <button
                    className={`tab ${activeTab === 'favorites' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favorites')}
                    style={{ '--tab-color': tabConfig.favorites.color } as React.CSSProperties}
                >
                    <span className="tab-icon">{tabConfig.favorites.icon}</span>
                    <span className="tab-title">Preferiti</span>
                    <span className="tab-count">{favorites.length}</span>
                </button>
            </div>

            <div className="tab-content">
                {currentList.length === 0 ? (
                    <div className="empty-watchlist">
                        <div className="empty-icon">{tabConfig[activeTab].icon}</div>
                        <p className="empty-message">{tabConfig[activeTab].emptyMessage}</p>
                        <Link to="/movies" className="btn btn-primary">
                            <span>🔍</span>
                            Scopri nuovi film
                        </Link>
                    </div>
                ) : (
                    <>
                    <div className="list-stats">
                        <h2 style={{color: tabConfig[activeTab].color}}>
                            {tabConfig[activeTab].title}
                        </h2>
                        <p className="list-count">
                            {currentList.length} {currentList.length === 1 ? 'film' : 'film'}
                            {activeTab === 'toWatch' ? ' da guardare' : activeTab === 'watched' ? ' visti' : ' preferiti'}
                        </p>
                    </div>

                    <div className="movies-grid">
                        {currentList.map((movie) => (
                            <MovieCard
                                key={movie.id}
                                movie={movie}
                                showWatchlistActions={true}
                                currentList={activeTab}
                            />
                        ))}
                    </div>
                    </>
                )}
            </div>
        </div>
    );
};