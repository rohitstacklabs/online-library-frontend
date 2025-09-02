import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import AuthContext from "../context/AuthContext";

const ForgotPassword = () => {
  const { forgotPassword } = useContext(AuthContext);
  const [serverMessage, setServerMessage] = useState(""); 

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    setServerMessage("");
    try {
      const response = await forgotPassword(data.email);
      setServerMessage(response?.message || "Reset link sent successfully.");
    } catch (err) {
      setServerMessage(err.response?.data?.message || "Failed to send reset link.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-800">
          Forgot Password
        </h2>

        {serverMessage && (
          <p
            className={`text-center mb-4 font-medium ${
              serverMessage.toLowerCase().includes("failed") ? "text-red-600" : "text-green-600"
            }`}
          >
            {serverMessage}
          </p>
        )}

        <form onSubmit={handleSubmit(onSubmit)} noValidate>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">
              Email <span className="text-red-600">*</span>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+\.\S+$/, message: "Invalid email format" },
              })}
              className={`w-full p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500
                ${errors.email ? "border-red-500" : "border-gray-300"}`}
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-indigo-600 text-white p-3 rounded-lg font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
