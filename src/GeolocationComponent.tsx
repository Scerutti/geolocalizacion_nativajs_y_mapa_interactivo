import React, { useState, useEffect } from 'react';

interface Location {
  latitude: number;
  longitude: number;
}

const GeolocationComponent: React.FC = () => {
  const [isGeolocationActive, setIsGeolocationActive] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);
  const intervalIdRef = React.useRef<number | null>(null);

  const startGeolocation = () => {
    setIsGeolocationActive(true);
    navigator.geolocation.getCurrentPosition((position) => { // funcion nativa de javascript https://developer.mozilla.org/es/docs/Web/API/Navigator
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });
  };

  const stopGeolocation = () => {
    setIsGeolocationActive(false);
    clearInterval(intervalIdRef.current as any);
  };

  useEffect(() => {


    if (isGeolocationActive) {
      startGeolocation();

      intervalIdRef.current = setInterval(() => {
        navigator.geolocation.getCurrentPosition((position) => {
          setLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        });
      }, 5 * 60 * 1000);
    }

    return () => {
      clearInterval(intervalIdRef.current as any);
    };
  }, [isGeolocationActive]);

  const handleButtonClick = () => {
    if (isGeolocationActive) {
      stopGeolocation();
    } else {
      startGeolocation();
    }
  };

  return (
    <div>
      <button onClick={handleButtonClick}>
        {isGeolocationActive ? 'Finalizar Geolocalización' : 'Iniciar Geolocalización'}
      </button>
      {location && (
        <p>
          Última ubicación conocida: Latitud {location.latitude}, Longitud {location.longitude}
        </p>
      )}
    </div>
  );
};

export default GeolocationComponent;
