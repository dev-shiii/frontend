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
  const [tracking, setTracking] = useState(null);

  const [showTrackModal, setShowTrackModal] = useState(false);
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const pollIntervalRef = useRef(null);

  // Load order
  const loadOrder = async () => {
    try {
      const res = await api.get(`/orders/${id}`);
      setOrder(res.data.order);
    } catch (err) {
      console.error("Order load error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load tracking
  const fetchTracking = async () => {
    try {
      const res = await api.get(`/api/tracking/${id}`); // ✔ FIXED URL
      setTracking(res.data);
      return res.data;
    } catch (err) {
      console.error("Tracking fetch error:", err);
      return null;
    }
  };

  // Load order and tracking on page load
  useEffect(() => {
    loadOrder();
    fetchTracking();
  }, [id]);

  // Open tracking modal + map
  const openTrackingModal = async () => {
    setShowTrackModal(true);

    const t = await fetchTracking();
    const maps = await loadGoogleMaps(import.meta.env.VITE_GOOGLE_MAPS_API_KEY);

    const center = t?.tracking?.currentLocation?.lat
      ? {
          lat: Number(t.tracking.currentLocation.lat),
          lng: Number(t.tracking.currentLocation.lng),
        }
      : { lat: 20.5937, lng: 78.9629 };

    if (!mapRef.current) {
      mapRef.current = new maps.Map(document.getElementById("order-track-map"), {
        center,
        zoom: 7,
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

    drawPath(t?.tracking?.history || []);

    // Poll updates
    pollIntervalRef.current = setInterval(async () => {
      const updated = await fetchTracking();
      if (!updated?.tracking) return;

      const loc = updated.tracking.currentLocation;
      const pos = { lat: Number(loc.lat), lng: Number(loc.lng) };

      markerRef.current.setPosition(pos);
      mapRef.current.panTo(pos);

      drawPath(updated.tracking.history || []);
    }, 10000);
  };

  const closeTrackingModal = () => {
    setShowTrackModal(false);
    clearInterval(pollIntervalRef.current);
  };

  // Drawing polyline on map
  const drawPath = (history = []) => {
    if (!window.google || !mapRef.current) return;

    if (mapRef.current._poly) {
      mapRef.current._poly.setMap(null);
    }

    const coords = history
      .filter((h) => h.location?.lat && h.location.lng)
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
    mapRef.current._poly = poly;
  };

  // Stripe payment
  const handlePayment = async () => {
    try {
      const res = await api.post("/payment/create-session", {
        billType: `Order Payment (${id})`,
        amount: order.totalAmount,
        payee: order?.userName || "Customer",
      });

      window.location.href = res.data.url;
    } catch (err) {
      alert("Payment failed");
    }
  };

  // Invoice download
  const downloadInvoice = async () => {
    try {
      const url = `${import.meta.env.VITE_API_URL}/orders/${id}/invoice`;
      const token = localStorage.getItem("token");

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = `invoice_${id}.pdf`;
      a.click();

      URL.revokeObjectURL(blobUrl);
    } catch (err) {
      alert("Invoice download failed");
    }
  };

  if (loading)
    return (
      <div className="text-white text-xl flex items-center justify-center min-h-screen relative">
        <ThreeWavyBackground />
        Loading order...
      </div>
    );

  return (
    <div className="relative min-h-screen px-6 py-10">
      <ThreeWavyBackground />
      <div className="max-w-4xl mx-auto relative z-10">

        <motion.div
          className="bg-white/10 backdrop-blur-lg border border-white/20 rounded-xl p-6 shadow-xl text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1 }}
        >
          <h2 className="text-2xl font-bold">Order #{order._id}</h2>

          <p className="text-gray-300 mt-1">
            Status: <span className="text-green-300">{order.status}</span>
          </p>

          {/* ⭐ Delivery Countdown */}
          {tracking?.delivery && (
            <p className="text-yellow-300 mt-1">
              Delivery in: {tracking.delivery.remainingDays} days
            </p>
          )}

          {/* ⭐ Delivered Message */}
          {tracking?.tracking?.status === "delivered" && (
            <p className="text-green-400 font-semibold text-lg mt-2">
              🎉 Your product is delivered!
            </p>
          )}

          <p className="text-gray-300 mt-2 mb-4">
            Total:{" "}
            <span className="text-green-400 font-semibold">
              ₹{order.totalAmount}
            </span>
          </p>

          <div className="flex gap-3 mt-4">
            <button onClick={handlePayment} className="px-4 py-2 bg-green-600 rounded">
              Pay Now
            </button>

            <button onClick={downloadInvoice} className="px-4 py-2 bg-blue-600 rounded">
              Download Invoice
            </button>

            <button onClick={openTrackingModal} className="px-4 py-2 bg-yellow-600 rounded">
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
              <img
                src={item.productId.image}
                className="w-20 h-20 rounded-xl object-cover"
              />
              <div>
                <p className="font-semibold">{item.productId.name}</p>
                <p className="text-gray-300 text-sm">Qty: {item.quantity}</p>
                <p className="text-gray-300 text-sm">
                  ₹{item.productId.price}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* TRACKING MODAL */}
        {showTrackModal && tracking && (
          <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div
              className="absolute inset-0 bg-black/60"
              onClick={closeTrackingModal}
            />

            <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 p-6 rounded-xl w-11/12 max-w-4xl text-white">
              <div className="flex justify-between">
                <h3 className="text-xl font-semibold">Package Tracking</h3>
                <button
                  onClick={closeTrackingModal}
                  className="px-4 py-1 bg-red-600 rounded"
                >
                  Close
                </button>
              </div>

              <p className="mt-2">
                Status: <strong>{tracking.tracking?.status}</strong>
              </p>

              {tracking.delivery && (
                <p className="text-yellow-300 mt-1">
                  Delivery in: {tracking.delivery.remainingDays} days
                </p>
              )}

              {tracking.tracking?.status === "delivered" && (
                <p className="text-green-400 text-lg font-semibold mt-2">
                  🎉 Your product is delivered!
                </p>
              )}

              <div id="order-track-map" style={{ height: 400, width: "100%" }} />

              <div className="mt-4 max-h-48 overflow-auto">
                <h4 className="font-semibold mb-2">Tracking History</h4>

                {tracking.tracking?.history?.length ? (
                  tracking.tracking.history.map((h, i) => (
                    <div key={i} className="text-sm py-2 border-b border-white/10">
                      <strong>{h.status}</strong> — {h.note}
                      <br />
                      <span className="text-xs text-gray-300">
                        {new Date(h.at).toLocaleString()}
                      </span>
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
