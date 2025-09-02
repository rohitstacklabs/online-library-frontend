import { useContext } from 'react';
import { useForm } from 'react-hook-form';
import AuthContext from '../context/AuthContext';
import { useSearchParams } from 'react-router-dom';

const ResetPassword = () => {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const { resetPassword } = useContext(AuthContext);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const onSubmit = (data) => {
    resetPassword({ ...data, token });
  };

  if (!token)
    return (
      <div
        className="min-h-screen flex items-center justify-center bg-cover bg-center px-4 text-red-600 text-lg font-semibold"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')" }}
      >
        Invalid reset link
      </div>
    );

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-cover bg-center px-4"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524995997946-a1c2e315a42f')" }}
    >
      <div className="bg-white bg-opacity-90 p-8 rounded-2xl shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-blue-600">🔑 Reset Password</h2>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="mb-4">
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              {...register('password', {
                required: 'Password is required',
                minLength: { value: 6, message: 'Min 6 characters' },
              })}
              className="w-full p-3 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
            {errors.password && <p className="text-red-500 text-sm">{errors.password.message}</p>}
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white p-3 rounded hover:bg-blue-600 transition"
          >
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;
