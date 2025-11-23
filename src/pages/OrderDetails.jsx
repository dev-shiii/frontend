import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";
import loadGoogleMaps from "../utils /loadGoogleMaps";




function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  // TRACKING UI state
  const [showTrackModal, setShowTrackModal] = useState(false);
  const [tracking, setTracking] = useState(null);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Load order info
  const load = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Load order error", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, [id]);

  // Fetch tracking data
  const fetchTracking = async () => {
    try {
      const res = await api.get(`/tracking/${id}`); 
      setTracking(res.data || null);
      return res.data;
    } catch (err) {
      console.error("Fetch tracking error", err);
      return null;
    }
  };

  // Open tracking modal + initialize map
  const openTrackingModal = async () => {
    setShowTrackModal(true);
    const t = await fetchTracking();

    try {
      const maps = await loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

      const center = t?.currentLocation?.lat
        ? { lat: Number(t.currentLocation.lat), lng: Number(t.currentLocation.lng) }
        : { lat: 20.5937, lng: 78.9629 }; // fallback: India center

      // Create map
      if (!mapRef.current) {
        mapRef.current = new maps.Map(document.getElementById("order-track-map"), {
          center,
          zoom: 8,
        });
      } else {
        mapRef.current.setCenter(center);
      }

      // Add marker
      if (!markerRef.current) {
        markerRef.current = new maps.Marker({
          position: center,
          map: mapRef.current,
          title: "Package",
        });
      } else {
        markerRef.current.setPosition(center);
      }

      drawHistoryPath(t?.history || []);

    } catch (err) {
      console.error("Google Maps error:", err);
      alert("Failed to load Google Maps. Check your API key.");
    }

    // Start live polling
    pollIntervalRef.current = setInterval(async () => {
      const newT = await fetchTracking();
      if (newT?.currentLocation && markerRef.current) {
        const pos = { lat: Number(newT.currentLocation.lat), lng: Number(newT.currentLocation.lng) };
        markerRef.current.setPosition(pos);
        mapRef.current.panTo(pos);
        drawHistoryPath(newT.history || []);
      }
    }, 10000);
  };

  // Close modal + stop polling
  const closeTrackingModal = () => {
    setShowTrackModal(false);
    clearInterval(pollIntervalRef.current);
    pollIntervalRef.current = null;
  };

  // Draw delivery path on map
  const drawHistoryPath = (history = []) => {
    if (!window.google || !window.google.maps || !mapRef.current) return;

    if (mapRef.current._trackPolyline) {
      mapRef.current._trackPolyline.setMap(null);
    }

    const coords = history
      .filter(h => h.location?.lat && h.location?.lng)
      .map(h => ({ lat: Number(h.location.lat), lng: Number(h.location.lng) }))
      .reverse();

    if (coords.length < 2) return;

    const poly = new window.google.maps.Polyline({
      path: coords,
      geodesic: true,
      strokeColor: "#2b8cfb",
      strokeOpacity: 0.9,
      strokeWeight: 4,
    });

    poly.setMap(mapRef.current);
    mapRef.current._trackPolyline = poly;
  };

  // Stripe Payment
  const handlePayment = async () => {
    try {
      const data = {
        billType: `Order Payment (${id})`,
        amount: order.totalAmount,
        payee: order?.userName || "Customer",
      };

      const res = await api.post("/payment/create-session", data);
      window.location.href = res.data.url;
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed");
    }
  };

  // Invoice Download
  const downloadInvoice = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/orders/${id}/invoice`;
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        method: "GET",
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Failed to download invoice");

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `invoice_${id}.pdf`;
      a.click();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      console.error("Invoice error:", err);
      alert("Failed to download invoice");
    }
  };

  if (loading)
    return (
      <div className="relative flex justify-center items-center min-h-screen text-white text-xl">
        <ThreeWavyBackground />
        Loading order...
      </div>
    );

  return (
    <div className="relative min-h-screen px-6 py-10">
      <ThreeWavyBackground />

      <div className="max-w-4xl mx-auto relative z-10">
        
        {/* Card */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h2 className="text-2xl font-bold mb-2">Order #{order._id}</h2>

          <p className="text-gray-300">
            Status: <span className="text-green-300 font-semibold">{order.status}</span>
          </p>

          <p className="text-gray-300">
            Total: <span className="text-green-400 font-semibold">₹{order.totalAmount}</span>
          </p>

          <div className="mt-6 flex gap-3">
            <button onClick={handlePayment} className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded">Pay Now</button>
            <button onClick={downloadInvoice} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded">Download Invoice</button>
            <button onClick={openTrackingModal} className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded">Track Package</button>
          </div>
        </motion.div>

        {/* ITEMS */}
        <div className="mt-6 space-y-4">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white/10 border border-white/20 p-4 rounded-xl backdrop-blur-lg text-white"
            >
              <img
                src={item.productId.image}
                alt={item.productId.name}
                className="w-20 h-20 object-cover rounded-xl"
              />
              <div>
                <p className="font-semibold">{item.productId.name}</p>
                <p className="text-gray-300 text-sm">Qty: {item.quantity}</p>
                <p className="text-gray-300 text-sm">₹{item.productId.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TRACKING MODAL */}
        {showTrackModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={closeTrackingModal}></div>

            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-xl w-11/12 max-w-4xl text-white">
              
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Package Tracking</h3>
                <button onClick={closeTrackingModal} className="px-4 py-1 bg-red-600 hover:bg-red-700 rounded">
                  Close
                </button>
              </div>

              <p className="text-sm mb-2">
                Status: <span className="font-semibold">{tracking?.status}</span>
              </p>

              {/* MAP */}
              <div id="order-track-map" style={{ height: 400, width: "100%" }} />

              {/* History */}
              <div className="mt-4 max-h-48 overflow-auto">
                <h4 className="font-semibold mb-2">Tracking History</h4>

                {tracking?.history?.length ? (
                  tracking.history.map((h, i) => (
                    <div key={i} className="text-sm py-2 border-b border-white/10">
                      <div><strong>{h.status}</strong> — {h.note || "update"}</div>
                      <div className="text-xs text-gray-300">{new Date(h.at).toLocaleString()}</div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300 text-sm">No tracking events yet.</p>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default OrderDetails;
