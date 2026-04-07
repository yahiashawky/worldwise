import { createContext, useCallback, useContext, useEffect, useReducer } from "react";
import PropTypes from 'prop-types';

const basic_URL = 'http://localhost:8000';


const CitiesContext = createContext()

CitiesProvider.propTypes = {
    children: PropTypes.node.isRequired,
}

const intialState = {
    cities: [],
    currentCity: {},
    isLoading: false,
    error: '',
}

function reducer(state , action){
    switch(action.type){
        case "loading" : 
            return {
                ...state,
                isLoading: true,
            }
        case "cities/loaded" : 
        return {
            ...state,
            cities: action.payload,
            isLoading: false,
        }
        case "city/loaded" :
            return {
                ...state,
                currentCity: action.payload,
                isLoading: false,
            }
        case "city/created" :
            return {
                ...state,
                cities: [...state.cities, action.payload],
                isLoading: false,
                currentCity: action.payload,
            }
        case "city/deleted" :
            return {
                ...state,
                cities: state.cities.filter(city => city.id !== action.payload),
                isLoading: false,
                currentCity: {},
            }   

        case "rejected" :
            return {
                ...state,
                isLoading: false,
            }    
        default : throw new Error(`Unknown action type: ${action.type}`)     
        }
}



function CitiesProvider({ children }) {

      const [{cities, currentCity, isLoading , error}, dispatch] = useReducer(reducer, intialState)

    useEffect(() => {
        const fetchCities = async () => {
                dispatch({type: "loading"})
          try {
            const response = await fetch(`${basic_URL}/cities`);
            const data = await response.json();
            dispatch({type: "cities/loaded", payload: data})
            } catch (error) {
                dispatch({type: "rejected" , payload: error.message || "Error fetching cities"})
            }
        }  
        fetchCities();
    }, [])

    const getCity = useCallback(async function getCity(id){

        if(Number(id) === currentCity.id) return;

            dispatch({type: "loading"})
        try{
            const response = await fetch(`${basic_URL}/cities/${id}`);
            const data = await response.json();
            dispatch({type: "city/loaded", payload: data})

        }
        catch(error){
            dispatch({type: "rejected" , payload: error.message || "Error fetching city"})
        }
    },[currentCity.id])

     async function createCity(newCity){
            dispatch({type: "loading"})
        try{
            const response = await fetch(`${basic_URL}/cities`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(newCity),
            });
            const data = await response.json();
                dispatch({type: "city/created", payload: data})
            
        }
        catch(error){
            dispatch({type: "rejected" , payload: error.message || "Error posting city"})
        }
    }
     async function deleteCity(id){
            dispatch({type: "loading"})
        try{
            const response = await fetch(`${basic_URL}/cities/${id}`, {
                method: "DELETE",
            });
            if(response.ok){
                dispatch({type: "city/deleted", payload: id})
            }
            
        }
        catch(error){
            dispatch({type: "rejected" , payload: error.message || "Error deleting city"})
        }
    }

    return(
        <CitiesContext.Provider 
        value={{
            cities,
            isLoading,
            currentCity,
            getCity,
            createCity,
            deleteCity,
            error,
            }}>
            {children}
        </CitiesContext.Provider>
    )
}

const useCities = () => {
    const context = useContext(CitiesContext);
    if (context === undefined) {
        throw new Error("useCities must be used within a CitiesProvider");
    }
    return context;
}

export { CitiesProvider, useCities };