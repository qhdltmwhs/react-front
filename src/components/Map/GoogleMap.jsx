import { useState, useMemo, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  Marker,
  InfoWindow,
} from "@react-google-maps/api";
import { sampleRestaurants } from "../../data/sampleRestaurants";

const mapContainerStyle = { width: "100%", height: "700px" };

const GoogleMapBasic = () => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  const center = useMemo(() => ({ lat: 37.5665, lng: 126.978 }), []); // 서울 중심
  const [mapInstance, setMapInstance] = useState(null);
  const [selected, setSelected] = useState(null);
  
  useEffect(() => {
    if (selected) {
      console.log("selected:", selected);
    }
  }, [selected]);

  if (loadError) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
  if (!isLoaded) return <div>지도를 불러오는 중입니다...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={(map) => setMapInstance(map)}
    >
      {/* 지도 위에 마커 추가 */}
      {sampleRestaurants.map((restaurant) => (
        <Marker
          key={restaurant.id}
          position={restaurant.position}
          onClick={() => setSelected(restaurant)}
          icon={{
            url: restaurant.thumbnail,
            scaledSize: new window.google.maps.Size(48, 48),
            origin: new window.google.maps.Point(0, 0),
            anchor: new window.google.maps.Point(24, 48),
          }}
        />
      ))}
    </GoogleMap>
  );
};

export default GoogleMapBasic;
