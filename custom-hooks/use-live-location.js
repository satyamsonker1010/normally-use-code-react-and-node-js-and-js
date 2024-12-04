import { useCallback, useEffect, useState } from "react";

export function useCurrentLocation(runEveryTime) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [alertActive, setAlertActive] = useState(false); 
  const [error, setError] = useState(null);
  const [everyTimeCheckLocation, setEveryTimeCheckLocation] = useState(!!runEveryTime);


  const getLongitudeAndLatitude = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position?.coords?.latitude;
          const longitude = position?.coords?.longitude;
          setLocation({ latitude, longitude });
          setError(null); // Clear any previous errors
          setAlertActive(false); // Stop alerting
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (err) => {
          if (err.code === err.PERMISSION_DENIED) {
            setError("Please enable location services.");
            setAlertActive(true); 
          } else if (err.code === err.POSITION_UNAVAILABLE) {
            setError("Unable to retrieve position. The location service might be unavailable.");
          } else if (err.code === err.TIMEOUT) {
            setError("Location request timed out. Please try again.");
          } else {
            setError("An unknown error occurred while retrieving your location.");
          }
          console.error("Error getting location: ", err);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000, 
          maximumAge: 0, // Avoid using a cached location
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      console.log("Geolocation is not supported by this browser.");
    }
  }, []);

  useEffect(() => {
    getLongitudeAndLatitude();
    let alertInterval;
    if (everyTimeCheckLocation && alertActive) {
      alertInterval = setInterval(() => {
        console.log("Location services are disabled. Please enable them to get your location.");
      }, 10000); 
    }

    return () => {
      clearInterval(alertInterval);
    };
  }, [alertActive, everyTimeCheckLocation]);

  return { location, setLocation, setEveryTimeCheckLocation, locationError: error };
}
