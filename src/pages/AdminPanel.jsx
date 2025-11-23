import { useEffect, useState, useContext } from "react";
import api from "../services/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function AdminPanel() {
  const { user } = useContext(AuthContext);
  const nav = useNavigate();

  const [users, setUsers] = useState([]);
  const [selectedUserOrders, setSelectedUserOrders] = useState([]);

  useEffect(() => {
    if (!user || user.role !== "admin") {
      return nav("/"); // block non-admins
    }

    loadUsers();
  }, []);

  const loadUsers = async () => {
    const res = await api.get("/admin/users");
    setUsers(res.data);
  };

  const viewOrders = async (id) => {
    const res = await api.get(`/admin/users/${id}/orders`);
    setSelectedUserOrders(res.data);
  };

  return (
    <div className="p-6 text-white">
      <h1 className="text-3xl font-bold mb-6">Admin Panel</h1>

      <div className="grid grid-cols-2 gap-8">
        
        {/* USERS LIST */}
        <div className="bg-white/10 p-4 rounded-xl">
          <h2 className="text-xl mb-4">All Users</h2>

          {users.map(u => (
            <div 
              key={u._id}
              className="p-3 mb-2 bg-white/20 rounded cursor-pointer hover:bg-white/30"
              onClick={() => viewOrders(u._id)}
            >
              <p className="font-semibold">{u.name}</p>
              <p className="text-sm">{u.email}</p>
              <p className="text-xs text-blue-300">Role: {u.role}</p>
            </div>
          ))}
        </div>

        {/* ORDERS OF SELECTED USER */}
        <div className="bg-white/10 p-4 rounded-xl">
          <h2 className="text-xl mb-4">User Orders</h2>

          {selectedUserOrders.length === 0 ? (
            <p>No orders found.</p>
          ) : (
            selectedUserOrders.map(order => (
              <div key={order._id} className="p-3 bg-white/20 mb-3 rounded">

                <p className="font-semibold">Order ID: {order._id}</p>
                <p>Status: {order.status}</p>
                <p>Total: ₹{order.totalAmount}</p>

                <ul className="mt-2">
                  {order.items.map(i => (
                    <li key={i._id}>
                      {i.productId?.name} — Qty: {i.quantity}
                    </li>
                  ))}
                </ul>

                {/* ⭐ TRACKING UPDATE FORM */}
                <div className="mt-4 p-3 bg-white/10 rounded border border-white/20">
                  <h3 className="text-lg font-bold mb-2 text-blue-300">
                    Update Tracking
                  </h3>

                  <label className="block text-sm">Latitude</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full p-2 bg-black/20 border border-white/30 rounded mb-2"
                    onChange={(e) => (order.tempLat = e.target.value)}
                    placeholder="Enter latitude"
                  />

                  <label className="block text-sm">Longitude</label>
                  <input
                    type="number"
                    step="any"
                    className="w-full p-2 bg-black/20 border border-white/30 rounded mb-2"
                    onChange={(e) => (order.tempLng = e.target.value)}
                    placeholder="Enter longitude"
                  />

                  <label className="block text-sm">Status</label>
                  <input
                    className="w-full p-2 bg-black/20 border border-white/30 rounded mb-2"
                    onChange={(e) => (order.tempStatus = e.target.value)}
                    placeholder="in_transit / out_for_delivery / delivered"
                  />

                  <label className="block text-sm">Note</label>
                  <input
                    className="w-full p-2 bg-black/20 border border-white/30 rounded mb-2"
                    onChange={(e) => (order.tempNote = e.target.value)}
                    placeholder="Optional update note"
                  />

                  <button
                    onClick={async () => {
                      try {
                        await api.patch(`/tracking/${order._id}`, {
                          lat: Number(order.tempLat),
                          lng: Number(order.tempLng),
                          status: order.tempStatus,
                          note: order.tempNote,
                        });

                        alert("Tracking updated!");
                      } catch (err) {
                        console.error(err);
                        alert("Failed to update tracking");
                      }
                    }}
                    className="w-full mt-2 bg-green-600 hover:bg-green-700 py-2 rounded text-white"
                  >
                    Save Tracking
                  </button>
                </div>
                {/* END TRACKING FORM */}

              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
