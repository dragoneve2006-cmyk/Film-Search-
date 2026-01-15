/**
 * Gestione dei film preferiti dell'utente tramite Zustand e localStorage
 */

import {create} from 'zustand';
import type {Movie} from '../types/movie';
import {getCurrentUser} from '../utils/authdb';

interface FavoritesState{
    favorites: Movie[];
    currentUserId: string | null;
    addFavorite: (movie: Movie) => void;
    removeFavorite: (movieId: number) => void;
    isFavorite: (movieId: number) => boolean;
    clearFavorites: () => void;
    loadUserFavorites: (userId: string) => void;
}

//Funzione per ottenere la key di localStorage basata sull'ID utente
const getUserStorageKey = (userId: string) => `favorites_${userId}`;

//Funzione per caricare i preferiti di un utente
const loadFavoritesFromStorage = (userId: string): Movie[] => {
    try{
        const stored = localStorage.getItem(getUserStorageKey(userId));
        if(stored){
            const parsed = JSON.parse(stored);
            return parsed.state?.favorites || [];
        }
    }catch (error){
        console.error('Errore durante il caricamento dei preferiti:', error);
    }
    return [];
};

//Funzione per salvare i preferiti 
const saveFavoritesToStorage = (userId: string, favorites: Movie[]) => {
    try {
        const data = {state:{favorites}, version: 0};
        localStorage.setItem(getUserStorageKey(userId), JSON.stringify(data));
    }catch (error){
        console.error('Errore nel salvataggio dei preferiti:', error);
    }
};


export const useFavorites = create<FavoritesState>((set, get) => {
    const currentUser = getCurrentUser();
    const initialUserId = currentUser?.id || null;
    const initialFavorites = initialUserId ? loadFavoritesFromStorage(initialUserId) : [];

    return{
        favorites: initialFavorites,
        currentUserId: initialUserId,

        //Aggiungo film ai preferiti
        addFavorite: (movie) => {
            const {currentUserId} = get();
            if(!currentUserId) return;

            set((state) => {
                const newFavorites = [...state.favorites, movie];
                saveFavoritesToStorage(currentUserId, newFavorites);
                return{favorites: newFavorites};
            });
        },

        //Rimozione film dai preferiti
        removeFavorite: (movieId) => {
            const{currentUserId} = get();
            if(!currentUserId) return;

            set((state) => {
                const newFavorites = state.favorites.filter((movie) => movie.id !== movieId);
                saveFavoritesToStorage(currentUserId, newFavorites);
                return{favorites: newFavorites};
            });
        },

        //Controllo la presenza del film nei preferiti
        isFavorite: (movieId) => {
            return get().favorites.some((movie) => movie.id === movieId);
        },

        //Pulizia dei preferiti
        clearFavorites: () => {
            set({favorites: [], currentUserId: null});
        },

        //Carico prefiriti utente
        loadUserFavorites: (userId: string) => {
            const favorites = loadFavoritesFromStorage(userId);
            set({favorites, currentUserId: userId});
        },
    };
});
