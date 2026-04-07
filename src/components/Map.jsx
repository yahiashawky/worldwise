import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import { MapContainer, Marker, Popup, TileLayer, useMap, useMapEvents } from "react-leaflet";
import { useCities } from "../customContexts/CitiesContext";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useGeolocation } from "../hooks/useGeolocation";
import Button from "./Button";
import { useUrlPosition } from "../hooks/useUrlPosition";

function Map() {
  const { cities } = useCities();
  const [mapPostion, setMapPosition] = useState([40, 0]);
  const {
    isLoading: isLoadingPosition,
    position: geoLocationPosition,
    getPosition,
  } = useGeolocation({});

  useEffect(() => {
    if (geoLocationPosition) {
      setMapPosition([geoLocationPosition.lat, geoLocationPosition.lng]);
    }
  }, [geoLocationPosition]);

  const [mapLat, mapLng] = useUrlPosition();

  useEffect(() => {
    if(mapLat && mapLng){
      setMapPosition([mapLat, mapLng])
    }
  }, [mapLat, mapLng])



  return (
    <div className={styles.mapContainer} >
       {
          !geoLocationPosition &&
           <Button type="position" 
           onClick={getPosition}
           >
            {isLoadingPosition ? 'Loading your location...' : 'get your Location'}
            </Button>
        }
      <MapContainer
        center={mapPostion}
        zoom={6}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
        />
        {cities.map((city) => (
          <Marker
            key={city.id}
            position={[city.position.lat, city.position.lng]}
          >
            <Popup>
              <span>{city.emoji}</span>
              <span>{city.cityName}</span>
            </Popup>
          </Marker>
        ))}
        <ChangeMapCenter position={mapPostion}  />
        <LocationMarker />
      </MapContainer>
    </div>
  );
}

ChangeMapCenter.propTypes = {
  position: PropTypes.arrayOf(PropTypes.string) || null,
}

function ChangeMapCenter({position}){
    const map = useMap();
    map.setView(position);
    return null;
}

function LocationMarker() {
  const [position, setPosition] = useState(null)
  const navigate = useNavigate();

   useMapEvents({
    click(e) {
      setPosition(e.latlng)
      navigate(`form?lat=${e.latlng.lat}&lng=${e.latlng.lng}`)

    },
  })

  return position === null ? null : (
    <Marker position={position}>
      <Popup>You are here</Popup>
    </Marker>
  )
}


export default Map;
