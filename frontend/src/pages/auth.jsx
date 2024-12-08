import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { register, login } from '../services/api';

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'student',
  });
  const navigate = useNavigate();

  const handleRegister = async (data) => {
    try {
      await register(data);
      handleLogin(data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.error || 'Registration failed!');
    }
  };

  const handleLogin = async (data) => {
    try {
      const response = await login(data);
      const { token, name, email, role, id } = response.data;
      sessionStorage.setItem('token', token);
      sessionStorage.setItem('name', name);
      sessionStorage.setItem('email', email);
      sessionStorage.setItem('role', role);
      sessionStorage.setItem('id', id);
      navigate('/courses');
    } catch (err) {
      console.error(err);
      alert('Login failed!');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    isLogin ? handleLogin(formData) : handleRegister(formData);
  };

  return (
    <div className="flex items-start justify-center min-h-screen bg-gray-100 py-10">
      <div className="w-full max-w-md p-8 space-y-6 bg-white shadow-lg rounded-md">
        <div className="flex justify-center mb-4">
          <div className="flex space-x-4">
            <button
              onClick={() => setIsLogin(true)}
              disabled={isLogin}
              className={`px-4 py-2 rounded-md font-medium ${
                isLogin
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              disabled={!isLogin}
              className={`px-4 py-2 rounded-md font-medium ${
                !isLogin
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
              }`}
            >
              Register
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your username"
                autoComplete="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              placeholder="Enter your email"
              autoComplete="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                autoComplete={!isLogin ? 'new-password' : 'current-password'}
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-2 pr-10 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center"
              >
                {showPassword ? '🙈' : '🐵'}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700">
                Role
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2 mt-1 border rounded-md focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="student">Student</option>
                <option value="instructor">Instructor</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 focus:outline-none"
          >
            {isLogin ? 'Login' : 'Register'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;
