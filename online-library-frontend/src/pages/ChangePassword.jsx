import { useForm } from "react-hook-form";
import { useContext, useState } from "react";
import AuthContext from "../context/AuthContext";
import { FaLock } from "react-icons/fa";
import { Eye, EyeOff } from "lucide-react";

const ChangePassword = () => {
  const { user, changePassword } = useContext(AuthContext);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [serverMessage, setServerMessage] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm();

  const newPassword = watch("newPassword", "");

  const onSubmit = async (data) => {
    setServerMessage("");
    try {
      await changePassword(data.currentPassword, data.newPassword);
      setServerMessage("Password updated successfully.");
      reset();
    } catch (err) {
      setServerMessage(
        err.response?.data?.message || "Failed to update password."
      );
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center relative px-4"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-lg w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 text-white flex items-center justify-center text-4xl font-bold shadow-md">
            {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
          </div>
          <h2 className="mt-4 text-2xl font-bold text-gray-800">
            Change Password
          </h2>
          <p className="text-indigo-600 font-semibold text-sm">{user?.email}</p>
        </div>

        {serverMessage && (
          <p
            className={`text-center mb-4 font-medium ${
              serverMessage.toLowerCase().includes("failed")
                ? "text-red-600"
                : "text-green-600"
            }`}
          >
            {serverMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Current Password <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type={showCurrent ? "text" : "password"}
                placeholder="Enter current password"
                {...register("currentPassword", { required: "Current password is required" })}
                className="w-full bg-transparent focus:outline-none"
              />
              <span
                className="ml-2 cursor-pointer text-gray-500"
                onClick={() => setShowCurrent(!showCurrent)}
              >
                {showCurrent ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.currentPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.currentPassword.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              New Password <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type={showNew ? "text" : "password"}
                placeholder="Enter new password"
                {...register("newPassword", {
                  required: "New password is required",
                  minLength: { value: 6, message: "Minimum 6 characters" },
                })}
                className="w-full bg-transparent focus:outline-none"
              />
              <span
                className="ml-2 cursor-pointer text-gray-500"
                onClick={() => setShowNew(!showNew)}
              >
                {showNew ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.newPassword && (
              <p className="text-red-500 text-sm mt-1">{errors.newPassword.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm New Password <span className="text-red-600">*</span>
            </label>
            <div className="flex items-center border rounded-lg px-3 py-2 shadow-sm bg-gray-50">
              <FaLock className="text-gray-500 mr-2" />
              <input
                type={showConfirm ? "text" : "password"}
                placeholder="Confirm new password"
                {...register("confirmPassword", {
                  required: "Please confirm your new password",
                  validate: (value) =>
                    value === newPassword || "Passwords do not match",
                })}
                className="w-full bg-transparent focus:outline-none"
              />
              <span
                className="ml-2 cursor-pointer text-gray-500"
                onClick={() => setShowConfirm(!showConfirm)}
              >
                {showConfirm ? <EyeOff size={20} /> : <Eye size={20} />}
              </span>
            </div>
            {errors.confirmPassword && (
              <p className="text-red-500 text-sm mt-1">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-2 rounded-lg shadow-md transition duration-200 disabled:opacity-50"
          >
            {isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
