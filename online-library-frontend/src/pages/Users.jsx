import { useState, useEffect } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import UserUpdateModal from "../components/UserUpdateModal";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await api.get("/users");
      setUsers(res.data.data);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this user?");
    if (!confirmDelete) return;

    try {
      await api.delete(`/users/${id}`);
      toast.success("User deleted successfully");
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user");
    }
  };

  const updateUser = async (id, updatedData) => {
    try {
      await api.put(`/users/${id}`, updatedData);
      toast.success("User updated successfully");
      setSelectedUser(null);
      fetchUsers();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user");
      throw err; // allows modal to handle validation errors
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 py-8"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')",
      }}
    >
      <div className="bg-white bg-opacity-90 p-6 md:p-8 rounded-2xl shadow-lg w-full max-w-6xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          👥 Users
        </h1>

        {loading ? (
          <p className="text-center text-gray-500">Loading users...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table-auto w-full border-collapse border shadow-sm rounded-lg">
              <thead className="bg-blue-500 text-white">
                <tr>
                  <th className="border p-3 text-left">ID</th>
                  <th className="border p-3 text-left">Name</th>
                  <th className="border p-3 text-left">Email</th>
                  <th className="border p-3 text-left">Role</th>
                  <th className="border p-3 text-left">Membership End</th>
                  <th className="border p-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr
                      key={user.id}
                      className="text-center hover:bg-gray-100 transition"
                    >
                      <td className="border p-3">{user.id}</td>
                      <td className="border p-3 font-medium">{user.name}</td>
                      <td className="border p-3">{user.email}</td>
                      <td className="border p-3">
                        <span
                          className={`px-2 py-1 text-xs rounded-full ${
                            user.role === "ADMIN"
                              ? "bg-red-100 text-red-600"
                              : "bg-green-100 text-green-600"
                          }`}
                        >
                          {user.role}
                        </span>
                      </td>
                      <td className="border p-3">{user.membershipEndDate || "—"}</td>
                      <td className="border p-3 flex items-center justify-center space-x-2">
                        <button
                          onClick={() => setSelectedUser(user)}
                          className="bg-yellow-500 hover:bg-yellow-600 text-white px-3 py-1 rounded-lg shadow transition"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-lg shadow transition"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center p-4 text-gray-500">
                      No users found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Update Modal */}
      {selectedUser && (
        <UserUpdateModal
          user={selectedUser}
          onClose={() => setSelectedUser(null)}
          onUpdate={updateUser}
        />
      )}
    </div>
  );
};

export default Users;
