import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const BookModal = ({ book, onClose, onSave }) => {
  const { register, handleSubmit, reset, watch } = useForm({
    defaultValues: {
      title: book?.title || "",
      author: book?.author || "",
      category: book?.category || "",
      status: book?.status || "AVAILABLE",
      isFavorite: book?.isFavorite || false,
      image: null,
    },
  });

  const watchImage = watch("image");

  const onSubmit = async (data) => {
    try {
      await onSave(data, book?.id);
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save book");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-lg relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          {book ? "✏️ Update Book" : "➕ Add Book"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <input
            placeholder="Title"
            {...register("title", { required: true })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            placeholder="Author"
            {...register("author", { required: true })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />
          <input
            placeholder="Category"
            {...register("category", { required: true })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          />

          <select
            {...register("status", { required: true })}
            className="w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 outline-none"
          >
            <option value="AVAILABLE">Available</option>
            <option value="TAKEN">Taken</option>
          </select>

          <div className="flex items-center gap-3">
            <input
              type="checkbox"
              {...register("isFavorite")}
              className="w-5 h-5 accent-indigo-600"
            />
            <label className="text-gray-700 font-medium">Mark as Favorite</label>
          </div>

          <div className="flex flex-col items-center">
            <input
              type="file"
              accept="image/*"
              {...register("image")}
              className="p-2 border rounded-lg shadow-sm"
            />
            {watchImage?.[0] && (
              <div className="w-40 h-40 mt-3 overflow-hidden rounded-lg border shadow flex items-center justify-center bg-gray-200">
                <img
                  src={URL.createObjectURL(watchImage[0])}
                  alt="preview"
                  className="w-full h-full object-contain"
                />
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button
              type="submit"
              className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg shadow-md font-semibold transition"
            >
              {book ? "Update Book" : "Add Book"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-400 hover:bg-gray-500 text-white py-3 rounded-lg shadow-md font-semibold transition"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookModal;