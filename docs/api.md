# 구글 Places API 연동 정리

## 1. 사용 API
- **Nearby Search** (주변 장소 검색)
  - 엔드포인트: `https://maps.googleapis.com/maps/api/place/nearbysearch/json`
  - 또는 Google Maps JavaScript API의 PlacesService.nearbySearch()

## 2. 주요 파라미터
- `key`: 구글 API 키
- `location`: 중심 좌표 (위도,경도) 예: `37.5665,126.9780`
- `radius`: 반경(m 단위, 최대 50,000)
- `type`: place type (예: `restaurant`)
- `keyword`: 검색어(선택)
- `minprice`, `maxprice`: 가격대(선택)
- `opennow`: 영업중 필터(선택)
- `rankby`: 정렬(기본은 prominence, `distance`도 가능)

## 3. 샘플 요청
```
GET https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=37.5665,126.9780&radius=2000&type=restaurant&key=YOUR_API_KEY
```

## 4. 샘플 응답 구조(일부)
```json
{
  "results": [
    {
      "place_id": "...",
      "name": "식당명",
      "geometry": { "location": { "lat": 37.5, "lng": 126.9 } },
      "vicinity": "주소",
      "rating": 4.3,
      "user_ratings_total": 120,
      "types": ["restaurant", ...],
      "photos": [ { "photo_reference": "..." } ],
      ...
    },
    ...
  ],
  "status": "OK"
}
```

## 5. 참고 링크
- [공식문서](https://developers.google.com/maps/documentation/places/web-service/search)
- [Place Types](https://developers.google.com/maps/documentation/places/web-service/supported_types)

---

- **주의:** CORS 문제로 프론트엔드에서 직접 호출 시 에러가 날 수 있음 (테스트 필요)
- **요금/쿼터**: 무료 할당량 초과 시 과금됨

## 6. 카테고리(종류) 구분 방법
- **types 배열**의 첫 번째 또는 두 번째 값이 주요 카테고리임
  - 예시:
    - `types: ["cafe", ...]` → 카페
    - `types: ["restaurant", ...]` → 일반 식당
    - `types: ["japanese_restaurant", ...]` → 일식
    - `types: ["korean_restaurant", ...]` → 한식
    - `types: ["chinese_restaurant", ...]` → 중식
    - `types: ["pizza_restaurant", ...]` → 피자
    - `types: ["bar", ...]` → 주점
- **단, 한식/중식/일식 등 세부 분류는 일부 식당만 제공**
  - 많은 경우 그냥 `restaurant`만 있음 (세부 분류 없음)
  - 카페, 바(bar), 패스트푸드 등은 잘 구분됨

## 7. 참고
- [Place Types 공식 목록](https://developers.google.com/maps/documentation/places/web-service/supported_types)
- 실제 응답에서 types 배열을 확인하여 UI에 반영 가능 

## 8. 반환 개수 및 필터링
- **Nearby Search의 최대 반환 개수는 20개** (스펙상 limit)
  - 공식문서: [Nearby Search](https://developers.google.com/maps/documentation/places/web-service/search-nearby)
  - 추가 결과가 있으면 next_page_token으로 페이징 가능(추가 요청 필요)
- **평점(rating) 필터는 API 파라미터에 없음**
  - 클라이언트에서 results 배열을 받아서 직접 filter 가능
  - 예: `results.filter(p => p.rating >= 3.5)`
- **type(종류) 필터도 클라이언트에서 가능**
  - 예: `results.filter(p => p.types.includes('cafe'))`

## 9. 사진(InfoWindow)
- **nearbySearch 응답의 photos 배열**에서 바로 getUrl로 썸네일/사진을 가져올 수 있음
  - 예: `p.photos[0].getUrl({ maxWidth: 80, maxHeight: 80 })`
- **더 많은 사진/상세 정보가 필요하면**
  - place_id로 PlacesService의 getDetails API를 별도 호출해야 함
  - getDetails 응답에서 상세 사진, 영업시간, 리뷰 등 추가 정보 제공

## 10. 참고
- [Place Types 공식 목록](https://developers.google.com/maps/documentation/places/web-service/supported_types)
- 실제 응답에서 types 배열을 확인하여 UI에 반영 가능 