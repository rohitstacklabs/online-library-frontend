import { useState, useEffect, useContext } from "react";
import api from "../services/api";
import { toast } from "react-toastify";
import AuthContext from "../context/AuthContext";
import { motion } from "framer-motion";
import BookModal from "../components/BookModal";
import { Heart } from "lucide-react";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [filters, setFilters] = useState({});
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [editingBook, setEditingBook] = useState(null);
  const { user } = useContext(AuthContext);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchBooks();
    }, 400);
    return () => clearTimeout(delayDebounce);
  }, [filters]);

  const fetchBooks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams(filters).toString();
      const res = await api.get(`/books?${params}`);
      setBooks(res.data.map((b) => ({ ...b, id: b.id || b.bookId })));
    } catch (err) {
      toast.error("Failed to fetch books");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetFilters = () => setFilters({});

  const borrowBook = async (bookId) => {
    if (!user) return toast.error("Please login to borrow a book");
    try {
      await api.post(`/users/${user.id}/borrow/${bookId}`);
      toast.success("Book borrowed");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to borrow");
    }
  };

  const saveBook = async (data, bookId) => {
    try {
      const formData = new FormData();
      formData.append("title", data.title);
      formData.append("author", data.author);
      formData.append("category", data.category);
      formData.append("status", data.status);
      formData.append("isFavorite", data.isFavorite ? "true" : "false");
      if (data.image?.[0]) formData.append("image", data.image[0]);

      setShowModal(false);
      const optimisticBook = {
        ...(bookId ? books.find((b) => b.id === bookId) : {}),
        ...data,
        id: bookId || Date.now(), 
        imageUrl: data.image?.[0]
          ? URL.createObjectURL(data.image[0])
          : bookId
          ? books.find((b) => b.id === bookId)?.imageUrl
          : null,
      };
      const prevBooks = [...books]; 
      setBooks((prev) =>
        bookId
          ? prev.map((b) => (b.id === bookId ? optimisticBook : b))
          : [...prev, optimisticBook]
      );

      if (bookId) await api.put(`/books/${bookId}`, formData);
      else await api.post("/books", formData);

      toast.success(bookId ? "Book updated" : "Book added");
      fetchBooks(); 
    } catch (err) {
      setBooks(prevBooks);
      setShowModal(true); 
      toast.error(err.response?.data?.message || "Failed to save book");
    }
  };

  const deleteBook = async (bookId) => {
    if (!window.confirm("Are you sure you want to delete this book?")) return;
    try {
      await api.delete(`/books/${bookId}`);
      toast.success("Book deleted");
      fetchBooks();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete book");
    }
  };

  const toggleFavorite = async (bookId, currentValue) => {
    try {
      setBooks((prev) =>
        prev.map((book) =>
          book.id === bookId ? { ...book, isFavorite: !currentValue } : book
        )
      );
    } catch (err) {
      toast.error("Failed to update favorite");
    }
  };

  const getImageUrl = (relativePath) => {
    if (!relativePath) return null;
    return `${api.defaults.baseURL}${relativePath}`;
  };

  const displayedBooks = showFavoritesOnly
    ? books.filter((b) => b.isFavorite)
    : books;

  return (
    <div className="relative min-h-screen w-full">
      <div
        className="absolute inset-0 bg-cover bg-center bg-fixed"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1920&q=80')",
        }}
      ></div>
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 py-10 px-4 flex justify-center">
        <div className="bg-white/50 backdrop-blur-md rounded-xl p-6 shadow-2xl max-w-7xl w-full">
          <h1 className="text-4xl font-extrabold mb-8 text-center text-indigo-800">
            📚 Library Books
          </h1>

          <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3 bg-white/90 backdrop-blur-md p-4 rounded-xl shadow-md">
              <input
                placeholder="Category"
                name="category"
                value={filters.category || ""}
                onChange={handleFilterChange}
                className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                placeholder="Author"
                name="author"
                value={filters.author || ""}
                onChange={handleFilterChange}
                className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <input
                placeholder="Book Name"
                name="name"
                value={filters.name || ""}
                onChange={handleFilterChange}
                className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              />
              <select
                name="status"
                value={filters.status || ""}
                onChange={handleFilterChange}
                className="p-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
              >
                <option value="">Status</option>
                <option value="AVAILABLE">Available</option>
                <option value="TAKEN">Taken</option>
              </select>
              <button
                onClick={resetFilters}
                className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg shadow-md font-medium transition"
              >
                Reset
              </button>

              <button
                type="button"
                onClick={() => setShowFavoritesOnly((prev) => !prev)}
                className={`px-5 py-2 rounded-lg shadow-md font-medium transition ${
                  showFavoritesOnly
                    ? "bg-pink-600 hover:bg-pink-700 text-white"
                    : "bg-gray-300 hover:bg-gray-400 text-gray-800"
                }`}
              >
                {showFavoritesOnly ? "Showing Favorites ❤️" : "Show Favorites Only"}
              </button>
            </div>

            {user && user.role === "ADMIN" && (
              <button
                onClick={() => {
                  setEditingBook(null);
                  setShowModal(true);
                }}
                className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg shadow-md font-semibold transition"
              >
                + Add Book
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading
              ? [...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="animate-pulse bg-gray-200 h-80 rounded-2xl"
                  ></div>
                ))
              : displayedBooks.map((book, index) => (
                  <motion.div
                    key={book.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1, duration: 0.5 }}
                    className="relative bg-gradient-to-br from-white to-gray-100 p-6 rounded-2xl shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition duration-300"
                  >
                    <div className="absolute top-3 left-3 bg-gray-200 text-gray-800 px-3 py-1 rounded-full text-sm font-semibold shadow">
                      ID: {book.id}
                    </div>

                    <button
                      onClick={() => toggleFavorite(book.id, book.isFavorite)}
                      className="absolute top-3 right-3 p-2 bg-white rounded-full shadow hover:scale-110 transition z-10"
                    >
                      <Heart
                        className={`w-6 h-6 ${
                          book.isFavorite
                            ? "fill-red-500 text-red-500"
                            : "text-gray-400"
                        }`}
                      />
                    </button>

                    {book.imageUrl && (
                      <div className="overflow-hidden rounded-lg mb-4 w-full h-64 flex items-center justify-center bg-gray-200">
                        <img
                          src={getImageUrl(book.imageUrl)}
                          alt={book.title}
                          className="w-full h-full object-contain transition-transform duration-300 transform hover:scale-105"
                        />
                      </div>
                    )}
                    <h2 className="text-2xl font-bold text-indigo-700">{book.title}</h2>
                    <p className="text-gray-700 mt-2">
                      <strong>Author:</strong> {book.author}
                    </p>
                    <p className="text-gray-700">
                      <strong>Category:</strong> {book.category}
                    </p>
                    <p
                      className={`mt-2 font-semibold ${
                        book.status === "AVAILABLE"
                          ? "text-green-600"
                          : "text-red-500"
                      }`}
                    >
                      {book.status}
                    </p>

                    {book.status === "AVAILABLE" && (
                      <button
                        onClick={() => borrowBook(book.id)}
                        className={`w-full mt-4 py-2 rounded-lg font-medium transition ${
                          user
                            ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                            : "bg-gray-400 text-white cursor-not-allowed"
                        }`}
                        disabled={!user}
                      >
                        Borrow
                      </button>
                    )}

                    {user && user.role === "ADMIN" && (
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() => {
                            setEditingBook(book);
                            setShowModal(true);
                          }}
                          className="flex-1 bg-yellow-500 hover:bg-yellow-600 text-white py-2 rounded-lg shadow"
                        >
                          Update
                        </button>
                        <button
                          onClick={() => deleteBook(book.id)}
                          className="flex-1 bg-red-500 hover:bg-red-600 text-white py-2 rounded-lg shadow"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </motion.div>
                ))}
          </div>
        </div>
      </div>

      {showModal && (
        <BookModal
          book={editingBook}
          onClose={() => setShowModal(false)}
          onSave={saveBook}
        />
      )}
    </div>
  );
};

export default Books;