import { useParams } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import api from "../services/api";
import { motion } from "framer-motion";
import ThreeWavyBackground from "../components/ThreeWavyBackground";
import loadGoogleMaps from "../utils/loadGoogleMaps";

function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  const [showTrackModal, setShowTrackModal] = useState(false);
  const [tracking, setTracking] = useState(null);

  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pollIntervalRef = useRef(null);

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

  const fetchTracking = async () => {
    try {
      const res = await api.get(`/tracking/${id}`);
      setTracking(res.data);
      return res.data;
    } catch (err) {
      console.error("Tracking error:", err);
      return null;
    }
  };

  useEffect(() => {
    load();
    fetchTracking();
  }, [id]);

  // disable background scroll
  useEffect(() => {
    document.body.style.overflow = showTrackModal ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [showTrackModal]);

  const openTrackingModal = async () => {
    setShowTrackModal(true);

    const t = await fetchTracking();
    if (!t) return;

    try {
      const maps = await loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

      const center = t?.tracking?.currentLocation?.lat
        ? {
            lat: Number(t.tracking.currentLocation.lat),
            lng: Number(t.tracking.currentLocation.lng),
          }
        : { lat: 20.5937, lng: 78.9629 };

      // 🟢 DRAGGABLE MAP ENABLED HERE
      if (!mapRef.current) {
        mapRef.current = new maps.Map(document.getElementById("order-track-map"), {
          center,
          zoom: 7,
          gestureHandling: "greedy",  // <—
          draggable: true,            // <—
          scrollwheel: true,          // <—
        });
      } else {
        mapRef.current.setCenter(center);
      }

      if (!markerRef.current) {
        markerRef.current = new maps.Marker({
          position: center,
          map: mapRef.current,
          title: "Package",
        });
      } else {
        markerRef.current.setPosition(center);
      }

      drawHistoryPath(t.tracking.history || []);
    } catch (err) {
      console.error("Google Maps Load Error:", err);
    }

    pollIntervalRef.current = setInterval(async () => {
      const newT = await fetchTracking();
      if (!newT?.tracking?.currentLocation) return;

      const pos = {
        lat: Number(newT.tracking.currentLocation.lat),
        lng: Number(newT.tracking.currentLocation.lng),
      };

      markerRef.current?.setPosition(pos);
      mapRef.current?.panTo(pos);

      drawHistoryPath(newT.tracking.history || []);
    }, 10000);
  };

  const closeTrackingModal = () => {
    setShowTrackModal(false);
    clearInterval(pollIntervalRef.current);
  };

  const drawHistoryPath = (history = []) => {
    if (!window.google || !mapRef.current) return;

    if (mapRef.current._path) mapRef.current._path.setMap(null);

    const coords = history
      .filter((h) => h.location?.lat && h.location?.lng)
      .map((h) => ({
        lat: Number(h.location.lat),
        lng: Number(h.location.lng),
      }))
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
    mapRef.current._path = poly;
  };

  const handlePayment = async () => {
    try {
      const res = await api.post("/payment/create-session", {
        billType: `Order Payment (${id})`,
        amount: order.totalAmount,
        payee: order?.userName || "Customer",
      });
      window.location.href = res.data.url;
    } catch {
      alert("Payment failed");
    }
  };

  const downloadInvoice = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/orders/${id}/invoice`;
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error("Invoice error");

      const blob = await res.blob();
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `invoice_${id}.pdf`;
      a.click();
    } catch {
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
        {/* ORDER INFO */}
        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold mb-2">Order #{order._id}</h2>

          <p className="text-gray-300 mb-1">
            Status:{" "}
            <span className="text-green-300 font-semibold">{order.status}</span>
          </p>

          {tracking?.delivery && (
            <p className="text-yellow-300 mb-1">
              Delivery in: {tracking.delivery.remainingDays} days
            </p>
          )}

          {tracking?.tracking?.status === "delivered" && (
            <p className="text-green-400 font-bold text-lg">🎉 Delivered!</p>
          )}

          <p className="text-gray-300 mb-4">
            Total:{" "}
            <span className="text-green-400 font-semibold">
              ₹{order.totalAmount}
            </span>
          </p>

          <div className="mt-4 flex gap-3">
            <button onClick={handlePayment} className="px-4 py-2 bg-green-600 rounded">
              Pay Now
            </button>
            <button onClick={downloadInvoice} className="px-4 py-2 bg-blue-600 rounded">
              Download Invoice
            </button>
            <button
              onClick={openTrackingModal}
              className="px-4 py-2 bg-yellow-600 rounded"
            >
              Track Package
            </button>
          </div>
        </motion.div>

        {/* ITEMS */}
        <div className="mt-6 space-y-4">
          {order.items.map((item) => (
            <div
              key={item._id}
              className="flex items-center gap-4 bg-white/10 p-4 rounded-xl border border-white/20 backdrop-blur-lg text-white"
            >
              <img src={item.productId.image} className="w-20 h-20 rounded-xl" />
              <div>
                <p className="font-semibold">{item.productId.name}</p>
                <p className="text-gray-300 text-sm">Qty: {item.quantity}</p>
                <p className="text-gray-300 text-sm">₹{item.productId.price}</p>
              </div>
            </div>
          ))}
        </div>

        {/* TRACKING MODAL */}
        {showTrackModal && tracking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/60" onClick={closeTrackingModal}></div>

            <div
              className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 
              p-6 rounded-xl w-11/12 max-w-4xl text-white max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between mb-3">
                <h3 className="text-xl font-semibold">Package Tracking</h3>
                <button onClick={closeTrackingModal} className="px-4 py-1 bg-red-600 rounded">
                  Close
                </button>
              </div>

              <p className="text-sm mb-1">
                Status: <span className="font-semibold">{tracking.tracking?.status}</span>
              </p>

              {tracking.delivery && (
                <p className="text-yellow-300 mb-2">
                  Delivery in: {tracking.delivery.remainingDays} days
                </p>
              )}

              {tracking.tracking?.status === "delivered" && (
                <p className="text-green-400 font-bold text-lg">
                  🎉 Your product is delivered!
                </p>
              )}

              <div id="order-track-map" style={{ height: 400, width: "100%" }} />

              <div className="mt-4 max-h-48 overflow-auto">
                <h4 className="font-semibold mb-2">Tracking History</h4>

                {tracking.tracking?.history?.length ? (
                  tracking.tracking.history.map((h, i) => (
                    <div key={i} className="text-sm py-2 border-b border-white/10">
                      <div>
                        <strong>{h.status}</strong> — {h.note}
                      </div>
                      <div className="text-xs text-gray-300">
                        {new Date(h.at).toLocaleString()}
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-300 text-sm">No tracking history.</p>
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
