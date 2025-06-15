import { useState, useMemo, useEffect } from "react";
import {
  useLoadScript,
  GoogleMap,
  OverlayView,
  InfoWindow,
} from "@react-google-maps/api";
import { sampleRestaurants } from "../../data/sampleRestaurants";

const mapContainerStyle = { width: "100%", height: "700px" };

// 커스텀 SVG 마커 컴포넌트
const CustomMarker = ({ restaurant, isSelected, onClick }) => {
  const getContentTypeColor = (type) => {
    switch (type) {
      case "korean":
        return "#FF6B6B";
      case "japanese":
        return "#4ECDC4";
      case "chinese":
        return "#45B7D1";
      case "western":
        return "#96CEB4";
      case "cafe":
        return "#FFEAA7";
      case "pub":
        return "#DDA0DD";
      default:
        return "#74B9FF";
    }
  };

  const getContentTypeIcon = (type) => {
    switch (type) {
      case "korean":
        return "🍚";
      case "japanese":
        return "🍣";
      case "chinese":
        return "🥟";
      case "western":
        return "🍝";
      case "cafe":
        return "☕";
      case "pub":
        return "🍺";
      default:
        return "🍽️";
    }
  };

  const getContentTypeLabel = (type) => {
    switch (type) {
      case "korean":
        return "한식";
      case "japanese":
        return "일식";
      case "chinese":
        return "중식";
      case "western":
        return "양식";
      case "cafe":
        return "카페";
      case "pub":
        return "주점";
      default:
        return "기타";
    }
  };

  const displayTitle =
    restaurant.name.length > 15
      ? restaurant.name.substring(0, 15) + "..."
      : restaurant.name;

  // type 필드가 없다면 기본값 사용하거나 다른 필드로 추정
  const restaurantType = restaurant.type || restaurant.category || "korean";
  const color = getContentTypeColor(restaurantType);
  const icon = getContentTypeIcon(restaurantType);
  const label = getContentTypeLabel(restaurantType);

  // 이벤트 전파 방지
  const handleClick = (e) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <div
      className="custom-marker"
      onClick={handleClick}
      style={{
        cursor: "pointer",
        transform: isSelected ? "scale(1.1)" : "scale(1)",
        transition: "transform 0.2s ease",
        filter: isSelected ? "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" : "none",
        zIndex: isSelected ? 1000 : 100,
      }}
    >
      <svg
        width="180"
        height="90"
        viewBox="0 0 180 90"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 그림자 */}
        <ellipse cx="90" cy="85" rx="30" ry="4" fill="rgba(0,0,0,0.15)" />

        {/* 메인 배경 */}
        <rect
          x="10"
          y="10"
          width="160"
          height="60"
          rx="30"
          fill="white"
          stroke={isSelected ? color : "#E5E7EB"}
          strokeWidth={isSelected ? "3" : "2"}
        />

        {/* 콘텐츠 타입 원 */}
        <circle
          cx="40"
          cy="40"
          r="18"
          fill={color}
          stroke="white"
          strokeWidth="2"
        />
        <text
          x="40"
          y="46"
          textAnchor="middle"
          fill="white"
          fontSize="16"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          {icon}
        </text>

        {/* 제목 */}
        <text
          x="65"
          y="32"
          fill="#1F2937"
          fontSize="12"
          fontWeight="600"
          fontFamily="Arial, sans-serif"
        >
          {displayTitle}
        </text>

        {/* 콘텐츠 타입 라벨 */}
        <text
          x="65"
          y="48"
          fill="#6B7280"
          fontSize="10"
          fontWeight="500"
          fontFamily="Arial, sans-serif"
        >
          {label} • ⭐{restaurant.rating}
        </text>

        {/* 포인터 */}
        <polygon
          points="85,70 95,70 90,80"
          fill="white"
          stroke={isSelected ? color : "#E5E7EB"}
          strokeWidth="2"
        />
      </svg>
    </div>
  );
};

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

  // 맵 클릭 시 InfoWindow 닫기
  const handleMapClick = () => {
    setSelected(null);
  };

  if (loadError) return <div>지도를 불러오는 중 오류가 발생했습니다.</div>;
  if (!isLoaded) return <div>지도를 불러오는 중입니다...</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13}
      onLoad={(map) => setMapInstance(map)}
      onClick={handleMapClick}
    >
      {/* 커스텀 SVG 마커들 */}
      {sampleRestaurants.map((restaurant, index) => (
        <OverlayView
          key={restaurant.id}
          position={restaurant.position}
          mapPaneName="overlayMouseTarget"
          getPixelPositionOffset={(width, height) => ({
            x: -(width / 2),
            y: -height,
          })}
        >
          <CustomMarker
            restaurant={restaurant}
            isSelected={selected?.id === restaurant.id}
            onClick={() => setSelected(restaurant)}
          />
        </OverlayView>
      ))}

      {/* 지도 마커 정보 창 - 위치를 마커와 겹치지 않게 조정 */}
      {selected && (
        <InfoWindow
          position={{
            lat: selected.position.lat + 0.002, // 마커보다 위쪽에 표시
            lng: selected.position.lng,
          }}
          onCloseClick={() => setSelected(null)}
          options={{
            pixelOffset: new window.google.maps.Size(0, -10),
          }}
        >
          <div
            style={{
              minWidth: 180,
              color: "black",
              background: "white",
              padding: 12,
              borderRadius: 12,
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            <img
              src={selected.thumbnail}
              alt={selected.name}
              style={{
                width: 60,
                height: 60,
                borderRadius: 8,
                objectFit: "cover",
                marginBottom: 8,
                display: "block",
                marginLeft: "auto",
                marginRight: "auto",
              }}
            />
            <h3
              style={{
                margin: "8px 0 4px 0",
                fontSize: 18,
                textAlign: "center",
              }}
            >
              {selected.name}
            </h3>
            <p style={{ margin: 0, fontSize: 14, textAlign: "center" }}>
              {selected.address}
            </p>
            <p
              style={{
                margin: 0,
                fontSize: 13,
                textAlign: "center",
                color: "#666",
              }}
            >
              평점: {selected.rating} ({selected.user_ratings_total}명)
            </p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
};

export default GoogleMapBasic;
