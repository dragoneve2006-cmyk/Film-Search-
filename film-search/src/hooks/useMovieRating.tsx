/**
 * Hook custom per gestione Rating dei film
 * 
 * @param movieId - ID del film
 * @returns Funzioni e stato relativi al rating del film
 */

import {useState, useEffect} from 'react';
import {moviesApi} from '../api/movies';
import {useAuth} from './useAuth';

export const useMovieRating = (movieId: number) => {
    const {user} = useAuth();
    const [userRating, setUserRating] = useState<number>(5);
    const [ratingMessage, setRatingMessage] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [hasRated, setHasRated] = useState<boolean>(false);

    //Carico il rating dell'utente per il film specificato
    useEffect(() => {
        const savedRating = moviesApi.getUserRating(movieId, user?.id);
        if(savedRating !== null){
            setUserRating(savedRating);
            setHasRated(true);
        }
    }, [movieId, user?.id]);

    //Invio valutazione del film
    const submitRating = async () => {
        setIsLoading(true);
        setRatingMessage('');

        try{
            const response = await moviesApi.rateMovie(movieId, userRating, user?.id);

            if(response.success){
                setRatingMessage(`✅ Film valutato con ${userRating}/10`);
                setHasRated(true);
                return{success: true, message: response.status_message};
            }else{
                const message = `⚠️ ${response.status_message}`;
                setRatingMessage(message);
                return{success: false, message: response.status_message};
            }
        }catch (error){
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la valutazione';
            setRatingMessage(`❌ ${errorMessage}`);
            return{success: false, message: errorMessage};
        }finally{
            setIsLoading(false);
            //Reset del messaggio a schermo dopo 5 secondi
            setTimeout(() => setRatingMessage(''), 5000);
        }
    };

    //Rimozione valutazione del film
    const removeRating = async () => {
        setIsLoading(true);
        setRatingMessage('');

        try{
            const response = await moviesApi.deleteMovieRating(movieId, user?.id);

            if(response.success){
                setRatingMessage('✅ Valutazione rimossa con successo');
                setHasRated(false);
                setUserRating(5);
                return{success: true, message: response.status_message};
            }else{
                const message = `⚠️ ${response.status_message}`;
                setRatingMessage(message);
                return{success: false, message: response.status_message};
            }
        }catch (error){
            const errorMessage = error instanceof Error ? error.message : 'Errore durante la rimozione della valutazione';
            setRatingMessage(`❌ ${errorMessage}`);
            return{success: false, message: errorMessage};
        }finally{
            setIsLoading(false);
            //Reset del messaggio a schermo dopo 5 secondi
            setTimeout(() => setRatingMessage(''), 5000);
        }
    };

    return{
        userRating,
        setUserRating,
        ratingMessage,
        isLoading,
        hasRated,
        submitRating,
        removeRating
    }


}