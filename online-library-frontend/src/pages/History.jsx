import { useState, useEffect, useContext } from 'react';
import api from '../services/api';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const History = () => {
  const [history, setHistory] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get(`/users/${user.id}/history`);
      setHistory(res.data.data); 
    } catch (err) {
      toast.error('Failed to fetch history');
    }
  };

  const returnBook = async (borrowId) => {
    try {
      await api.post(`/users/${user.id}/return/${borrowId}`);
      toast.success('Book returned');
      fetchHistory();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to return');
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-5xl">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">📚 Borrow History</h1>
        <div className="overflow-x-auto">
          <table className="table-auto w-full border-collapse border shadow-sm rounded-lg">
            <thead className="bg-blue-500 text-white">
              <tr>
                <th className="border p-3">Book Title</th>
                <th className="border p-3">Taken Date</th>
                <th className="border p-3">Returned Date</th>
                <th className="border p-3">Actions</th>
              </tr>
            </thead>
            <tbody>
              {history.length > 0 ? (
                history.map((item) => (
                  <tr key={item.id} className="text-center hover:bg-gray-100">
                    <td className="border p-3">{item.book.title}</td>
                    <td className="border p-3">{item.takenDate}</td>
                    <td className="border p-3">{item.returnedDate || '⏳ Not Returned'}</td>
                    <td className="border p-3">
                      {!item.returnedDate && (
                        <button
                          onClick={() => returnBook(item.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                        >
                          Return
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-center p-4 text-gray-500">
                    No history found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default History;
