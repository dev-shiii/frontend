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
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
