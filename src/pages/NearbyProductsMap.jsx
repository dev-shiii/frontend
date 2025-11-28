// client/src/pages/NearbyProductsMap.jsx
import React, { useEffect, useRef, useState } from "react";
import api from "../services/api";
import loadGoogleMaps from "../utils/loadGoogleMaps";
import { useNavigate } from "react-router-dom";

export default function NearbyProductsMap({ defaultRadiusKm = 50 }) {
  const mapRef = useRef(null);
  const markersRef = useRef([]);
  const userMarkerRef = useRef(null);

  const [status, setStatus] = useState("idle");
  const [products, setProducts] = useState([]);

  const navigate = useNavigate(); // ⭐ ADDED for redirecting

  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus("err");
      return;
    }

    setStatus("fetching");

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;

        try {
          const res = await api.get(
            `/products/nearby?lat=${lat}&lng=${lng}&radiusKm=${defaultRadiusKm}`
          );

          setProducts(res.data.products || []);
          setStatus("ready");

          const maps = await loadGoogleMaps(
            import.meta.env.VITE_GOOGLE_MAPS_API_KEY
          );

          const center = { lat, lng };

          mapRef.current = new maps.Map(document.getElementById("nearby-map"), {
            center,
            zoom: 12,
          });

          // ⭐ USER marker
          userMarkerRef.current = new maps.Marker({
            position: center,
            map: mapRef.current,
            title: "You are here",
            icon: {
              path: maps.SymbolPath.CIRCLE,
              scale: 8,
              fillColor: "#2b8cfb",
              fillOpacity: 1,
              strokeColor: "white",
              strokeWeight: 2,
            },
          });

          // Clear old markers
          markersRef.current.forEach((m) => m.setMap(null));
          markersRef.current = [];

          // ⭐ ADD PRODUCT MARKERS
          res.data.products.forEach((p) => {
            const position = {
              lat: Number(p.location.lat),
              lng: Number(p.location.lng),
            };

            const marker = new maps.Marker({
              position,
              map: mapRef.current,
              title: p.name,
            });

            // ⭐ CLICK → Redirect user to product page
            marker.addListener("click", () => {
              navigate(`/products/${p._id}?selected=true`);
            });

            markersRef.current.push(marker);
          });

          // Fit bounds
          const bounds = new maps.LatLngBounds();
          bounds.extend(center);
          res.data.products.forEach((p) =>
            bounds.extend({
              lat: Number(p.location.lat),
              lng: Number(p.location.lng),
            })
          );

          mapRef.current.fitBounds(bounds, 80);
        } catch (err) {
          console.error("Nearby map error", err);
          setStatus("err");
        }
      },
      () => setStatus("err"),
      { enableHighAccuracy: true, timeout: 10000 }
    );

    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      if (userMarkerRef.current) userMarkerRef.current.setMap(null);
    };
  }, []);

  return (
    <div className="max-w-5xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-3">Nearby Products</h2>

      {status === "fetching" && <p>Requesting your location...</p>}
      {status === "err" && (
        <p className="text-red-400">
          Unable to get location or load map. Check permissions & API key.
        </p>
      )}

      <div
        id="nearby-map"
        style={{ width: "100%", height: 560, borderRadius: 8 }}
      />

      <div className="mt-4">
        <h3 className="font-semibold">Products found: {products.length}</h3>

        <ul className="mt-2 space-y-2">
          {products.map((p) => (
            <li key={p._id} className="bg-white/5 p-3 rounded">
              <div className="flex justify-between items-center">
                <div>
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-xs text-gray-300">{p.category}</div>
                </div>
                <div className="text-right">
                  <div>₹{p.price}</div>
                  <div className="text-sm text-yellow-300">{p.distance} km</div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
