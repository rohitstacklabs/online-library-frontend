import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";

const UserUpdateModal = ({ user, onClose, onUpdate }) => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (user) {
      reset({
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        membershipStartDate: user.membershipStartDate,
        membershipEndDate: user.membershipEndDate,
      });
    }
  }, [user, reset]);

  const onSubmit = async (data) => {
    if (new Date(data.membershipEndDate) < new Date(data.membershipStartDate)) {
      toast.error("❌ Membership End Date cannot be before Start Date");
      return;
    }

    setLoading(true);
    try {
      await onUpdate(user.id, {
        ...user, 
        ...data, 
      });

      toast.success("✅ User updated successfully!", {
        position: "top-center",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: false,
        draggable: true,
        theme: "colored",
      });

      setTimeout(() => {
        onClose();
      }, 2000);

    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Failed to update user");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 text-xl"
        >
          ✖
        </button>

        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          ✏️ Update User
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Name
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Name is required",
                minLength: {
                  value: 2,
                  message: "Name must be at least 2 characters",
                },
              })}
              className={`w-full border px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-300 ${
                errors.name ? "border-red-500" : ""
              }`}
            />
            {errors.name && (
              <p className="text-red-500 text-sm mt-1">
                {errors.name.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[^@ ]+@[^@ ]+\.[^@ .]{2,}$/,
                  message: "Invalid email address",
                },
              })}
              className={`w-full border px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-300 ${
                errors.email ? "border-red-500" : ""
              }`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              {...register("role", { required: "Role is required" })}
              className={`w-full border px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-300 ${
                errors.role ? "border-red-500" : ""
              }`}
            >
              <option value="USER">USER</option>
              <option value="ADMIN">ADMIN</option>
            </select>
            {errors.role && (
              <p className="text-red-500 text-sm mt-1">
                {errors.role.message}
              </p>
            )}
          </div>

          <input type="hidden" {...register("membershipStartDate")} />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Membership End Date
            </label>
            <input
              type="date"
              {...register("membershipEndDate", {
                required: "Membership End Date is required",
              })}
              className={`w-full border px-3 py-2 rounded-lg bg-gray-50 focus:outline-none focus:ring focus:ring-indigo-300 ${
                errors.membershipEndDate ? "border-red-500" : ""
              }`}
            />
            {errors.membershipEndDate && (
              <p className="text-red-500 text-sm mt-1">
                {errors.membershipEndDate.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg shadow-md transition ${
              loading ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "Updating..." : "Update User"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UserUpdateModal;
