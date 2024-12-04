import { useEffect, useState } from "react";

export function useCurrentLocation(runEveryTime) {
  const [location, setLocation] = useState({ latitude: null, longitude: null });
  const [alertActive, setAlertActive] = useState(false);
  const [error, setError] = useState(null);
  const [everyTimeCheckLocation, setEveryTimeCheckLocation] =
    useState(!!runEveryTime);

  // Get location function
  const getLongitudeAndLatitude = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          setLocation({ latitude, longitude });
          setError(null); // Clear any previous errors
          setAlertActive(false); // Stop alerting
          console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
        },
        (error) => {
          if (error.code === error.PERMISSION_DENIED) {
            setError(
              "Please enable location services. \n" 
              // +
              //   "To enable location:\n" +
              //   "1. In your browser, click on the lock icon in the address bar.\n" +
              //   "2. Select 'Site settings'.\n" +
              //   "3. Find 'Location' and set it to 'Allow'.\n\n" +
              //   "On mobile devices:\n" +
              //   "1. Open your device's settings.\n" +
              //   "2. Navigate to 'Privacy' or 'Location'.\n" +
              //   "3. Find your browser in the app list and enable location access."
            );
            setAlertActive(true); // Start alerting
          } else {
            setError("Error: Unable to retrieve location.");
          }
          console.error("Error getting location: ", error);
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
      console.log("Geolocation is not supported by this browser.");
    }
  };

  useEffect(() => {
    getLongitudeAndLatitude();
    let alertInterval;
    if (everyTimeCheckLocation) {
      alertInterval = setInterval(() => {
        if (alertActive) {
          console.log(
            "Location services are disabled. Please enable them to get your location."
          );
        }
      }, 10000); // Show alert every 10 seconds
    }
    return () => clearInterval(alertInterval); // Clean up on unmount
  }, [alertActive, everyTimeCheckLocation]);

  return { location, setLocation, setEveryTimeCheckLocation , locationError:error };
}
