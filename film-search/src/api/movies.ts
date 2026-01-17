//Creazione GESTIONE API MOVIE
import axios from 'axios';
import type { MovieResponse, MovieDetails, Cast, RatingResponse } from  '../types/movie';

const API_KEY = '4e44d9029b1270a757cddc766a1bcb63'
const BASE_URL = 'https://api.themoviedb.org/3';


const api = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
        language: 'it-IT',
    },
});


export const moviesApi = {
    //CERCA FILM PER TITOLO
    searchMovies: async (query: string, page: number = 1): Promise<MovieResponse> => {
        const response = await api.get<MovieResponse>('/search/movie', {
            params: {
                query,
                page,
            },
        });
        return response.data;
    },

    //FILM POPOLARI
    getPopularMovies: async (page: number = 1): Promise<MovieResponse> => {
        const response = await api.get<MovieResponse>('/movie/popular', {
            params: {
                page,
            },
        });
        return response.data;
    },

    //FILM IN TENDENZA
    getTrendingMovies: async (page = 1) : Promise<MovieResponse> => {
        const response = await api.get('/trending/movie/week', {
            params: {
                page,
            },
        });
        return response.data;
    },

    //DETTAGLI FILM
    getMovieDetails: async (movieId: number): Promise<MovieDetails> => {
        const response = await api.get<MovieDetails>(`/movie/${movieId}`);
        return response.data;
    },

    //CAST FILM
    getMovieCredits: async (movieId: number): Promise<Cast[]> => {
        const response = await api.get<{ cast: Cast[] }>(`/movie/${movieId}/credits`);
        return response.data.cast;
    },

    //GENERI
    getMovieGenres: async (): Promise<{ id: number; name: string }[]> => {
        const response = await api.get<{ genres: { id: number; name: string }[] }>('/genre/movie/list');
        return response.data.genres;
    },

    //FILM PER GENERE
    getMoviesByGenre: async (genreId: number, page: number = 1): Promise<MovieResponse> => {
        const response = await api.get<MovieResponse>('/discover/movie', {
            params: {
                with_genres: genreId,
                page,
            },
        });
        return response.data;
    },

    /**
 * Valutazione Film con chiamata POST (in locale)
 * @param movieId - ID film
 * @param rating - Valutazione da (0.5 - 10.0 | incremento di 0.5)
 * @param userId - Id utente che valuta
 * @param Promise - Promise risposta simulata
 * @return Error - valutazione non valida
 */

rateMovie: async (movieId:number, rating: number, userId: string): Promise<RatingResponse> => {
    //Controllo valutazione
    if(rating < 0.5 || rating > 10){
        throw new Error('La valutazione deve essere compresa tra 0.5 e 10');
    }
    if(rating % 0.5 !== 0){
        throw new Error('Il rating deve essere un multiplo di 0.5');
    }

    //Simulazione Valutazione con chiamata POST + delay
    await new Promise(resolve => setTimeout(resolve, 500));

    try{
        //Salvattaggio nel local storage
        const ratingsKey = userId ? `ratings_X${userId}`: 'ratings_guest';
        const existingRatings = localStorage.getItem(ratingsKey);
        const ratings: Record<number, number> = existingRatings ? JSON.parse(existingRatings) : {};

        ratings[movieId] = rating;
        localStorage.setItem(ratingsKey, JSON.stringify(ratings));

        return{
            success: true,
            status_code: 1,
            status_message: 'Valutazione salvata con successo',
        };
    }catch{
        throw new Error('Errore durante il salvataggio della valutazione');
    }
},

/**
 * Rimozione Valutazione Film
 * Viene rimosso dal lacal storage del utente 
 * @param movieId - ID film
 * @param userId - Id utente che rimuove la valutazione
 * @param Promise - Promise risposta simulata
 */

deleteMovieRating: async (movieId: number, userId: string): Promise<RatingResponse> => {
    //Simulazione rimozione valutazione con delay con chiamata POST
    await new Promise(resolve => setTimeout(resolve, 500));

    try{
        const ratingKey = userId ? `ratings_${userId}`: 'ratings_guest';
        const existingRatings = localStorage.getItem(ratingKey);

        if(!existingRatings){
            return{
                success: false,
                status_code: 34,
                status_message: 'Non hai ancora valutato questo film',
            };
        }

        const ratings: Record<number, number> = JSON.parse(existingRatings);

        if(!(movieId in ratings)){
            return{
                success: false,
                status_code: 34,
                status_message: 'Non hai ancora valutato questo film',
            };
        }

        delete ratings[movieId];
        localStorage.setItem(ratingKey, JSON.stringify(ratings));

        return{
            success: true,
            status_code: 1,
            status_message: 'Valutazione rimossa con successo',
        };
    }catch{
        throw new Error('Errore durante la rimozione della valutazione');
    }
},

/**
 * Valutazione Utente Film Specifico
 * @param movieId - ID film
 * @param userId - Id utente che valuta
 * @return Rating dell'utente o null se non esiste
 */

getUserRating: (movieId: number, userId: string): number | null => {
    try{
        const ratingsKey = userId ? `ratings_${userId}`: 'ratings_guest';
        const existingRatings = localStorage.getItem(ratingsKey);
    
        if(!existingRatings){
            return null;
        }

        const ratings: Record<number, number> = JSON.parse(existingRatings);
        return ratings[movieId] || null;
    }catch{
        return null;
    }
},

};

//URL IMMAGINE
export const getImageUrl = (path: string | null, size: 'w200' | 'w500' | 'original' = 'w500'): string => {
    if (!path) return 'https://via.placeholder.com/500x750?text=No+Image';
    return `https://image.tmdb.org/t/p/${size}${path}`;
};




