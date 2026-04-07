import { useState } from "react";
import { useNavigate } from "react-router-dom";

export function useGeolocation({defaultPosition = null}) {
  const [isLoading, setIsLoading] = useState(false);
  const [position, setPosition] = useState(defaultPosition);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  function getPosition(){
    if(!navigator.geolocation) return setError("Geolocation is not supported by your browser");
    

    setIsLoading(true);
    navigator.geolocation.getCurrentPosition((position) => {
        setPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
        });
        navigate(`?lat=${position.coords.latitude}&lng=${position.coords.longitude}`);
        setError(null);
        setIsLoading(false);
    }, (error) => {
        setError(error.message);
        setIsLoading(false);
    })
  }
    return {
        position,
        getPosition,
        isLoading,
        error,
    }
}