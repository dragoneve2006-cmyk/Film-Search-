import {create} from 'zustand';
import type {Movie} from '../types/movie';
import {getCurrentUser} from '../utils/authdb';

//Hook custom per la gestione della watchlist
interface WatchlistStore{
    toWatch: Movie[];
    watched: Movie[];
    currentUserId: string | null;
    addToWatch: (movie: Movie) => void;
    removeFromToWatch: (movieId: number) => void;
    addToWatched: (movie: Movie) => void;
    removeFromWatched: (movieId: number) => void;
    moveToWatched: (movie: Movie) => void;
    moveToToWatch: (movie: Movie) => void;
    isInToWatch: (movieId: number) => boolean;
    isInWatched: (movieId: number) => boolean;
    clearWatchlist: () => void;
    loadUserWatchlist: (userId: string) => void;
}

//Gestione localStorage della watchlist
const getUserStorageKey = (userId: string, type: 'toWatch' | 'watched') => 
    `watchlist-${type}-${userId}`;

//Carica la watchlist dal localStorage
const loadListFromStorage = (userId: string, type: 'toWatch' | 'watched'): Movie[] => {
    try{
        const stored = localStorage.getItem(getUserStorageKey(userId, type));
        if(stored){
            const parsed = JSON.parse(stored);
            return parsed.state?.movies || [];
        }
    }catch (error){
        console.error(`Errore nel caricamento della watchlist ${type}:`,error);
    }
    return[];
};

//Salva la watchlist nel localStorage
const saveListToStorage = (userId: string, type: 'toWatch' | 'watched', movies: Movie[]) => {
    try{
        const data = {state: {movies}, version: 0};
        localStorage.setItem(getUserStorageKey(userId, type), JSON.stringify(data));
    }catch (error){
        console.error(`Errore durante il salvataggio della watchlist ${type}:`, error);
    }
};

export const useWatchlist = create<WatchlistStore>()((set, get) => {
    const currentUser = getCurrentUser();
    const initialUserId = currentUser?.id || null;
    const initialToWatch = initialUserId ? loadListFromStorage(initialUserId, 'toWatch') : [];
    const initialWatched = initialUserId ? loadListFromStorage(initialUserId, 'watched') : [];

    return{
        toWatch: initialToWatch,
        watched: initialWatched,
        currentUserId: initialUserId,

        addToWatch: (movie) => {
            const {currentUserId} = get();
            if(!currentUserId)
                return;

            set((state) => {
                const newWatched = state.watched.filter(m => m.id !== movie.id);
                const newToWatch = [...state.toWatch, movie];
                saveListToStorage(currentUserId, 'toWatch', newToWatch);
                saveListToStorage(currentUserId, 'watched', newWatched);
                return {
                    toWatch: newToWatch,
                    watched: newWatched
                };
            });
        },

        removeFromToWatch: (movieId) => {
            const {currentUserId} = get();
            if(!currentUserId)
                return;

            set((state) => {
                const newToWatch = state.toWatch.filter((movie) => movie.id !== movieId);
                saveListToStorage(currentUserId, 'toWatch', newToWatch);
                return{
                    toWatch: newToWatch
                };
            });
        },

        addToWatched: (movie) => {
            const {currentUserId} = get();
            if(!currentUserId) 
                return;

            set((state) => {
                const newToWatch = state.toWatch.filter(m => m.id !== movie.id);
                const newWatched = [...state.watched, movie];
                saveListToStorage(currentUserId, 'toWatch', newToWatch);
                saveListToStorage(currentUserId, 'watched', newWatched);
                return {
                    toWatch: newToWatch,
                    watched: newWatched
                };
            });
        },

        removeFromWatched: (movieId) => {
            const {currentUserId} = get();
            if(!currentUserId)
                return;

            set((state) => {
                const newWatched = state.watched.filter((movie) => movie.id !== movieId);
                saveListToStorage(currentUserId, 'watched', newWatched);
                return{
                    watched: newWatched
                };
            });
        },
        
        moveToWatched: (movie) => {
            get().addToWatched(movie);
        },

        moveToToWatch: (movie) => {
            get().addToWatch(movie);
        },

        isInToWatch: (movieId) => {
            return get().toWatch.some((movie) => movie.id === movieId);
        },

        isInWatched: (movieId) => {
            return get().watched.some((movie) => movie.id === movieId);
        }, 

        clearWatchlist: () => {
            set({toWatch: [], watched: [], currentUserId: null});
        },

        loadUserWatchlist: (userId: string) => {
            const toWatch = loadListFromStorage(userId, 'toWatch');
            const watched = loadListFromStorage(userId, 'watched');
            set({toWatch, watched, currentUserId : userId});
        },
    };
});
