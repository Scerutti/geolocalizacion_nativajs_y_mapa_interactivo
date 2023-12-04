import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import ambulanceSVG from "./assets/ambulance.svg"
import L from 'leaflet';

import 'leaflet/dist/leaflet.css';

interface Location {
  latitude: number;
  longitude: number;
}

const GeolocationComponent: React.FC = () => {
  const [isGeolocationActive, setIsGeolocationActive] = useState<boolean>(false);
  const [mapVisible, setMapVisible] = useState<boolean>(false);
  const [location, setLocation] = useState<Location | null>(null);
  const intervalIdRef = useRef<number | null>(null);

  const startGeolocation = () => {
    setIsGeolocationActive(true);
    setMapVisible(true);

    navigator.geolocation.getCurrentPosition((position) => {
      setLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });
    });

    intervalIdRef.current = setInterval(() => {
      navigator.geolocation.getCurrentPosition((position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }, 5 * 60 * 1000); // 5 minutos en milisegundos
  };

  const stopGeolocation = () => {
    setIsGeolocationActive(false);
    setMapVisible(false);
    if (intervalIdRef.current !== null) {
      clearInterval(intervalIdRef.current);
      intervalIdRef.current = null;
    }
  };

  useEffect(() => {
    if (isGeolocationActive) {
      startGeolocation();
    }

    return () => {
      if (intervalIdRef.current !== null) {
        clearInterval(intervalIdRef.current);
        intervalIdRef.current = null;
      }
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
      {mapVisible && location && (
        <MapContainer
          center={[location.latitude, location.longitude]}
          zoom={14}
          style={{ height: '400px', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <Marker position={[location.latitude, location.longitude]} icon={AmbulanceMarker}>
            <Popup>
              Esta es la descripcion de la ambulancia <br /> Y es customizable
            </Popup>
          </Marker>
        </MapContainer>
      )}
    </div>
  );
};

export default GeolocationComponent;


const AmbulanceMarker = new L.Icon({
  iconUrl: ambulanceSVG,
  iconSize: [30, 30],
  iconAnchor: [15, 15],
});