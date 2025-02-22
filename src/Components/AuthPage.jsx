import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AuthPage = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, password, name } = formData;

    try {
      if (isLogin) {
        const response = await axios.post(
          "https://ecommerce-server-0slo.onrender.com/api/auth/signin",
          { email, password }
        );

        if (response.status === 200) {
          const { token, user } = response.data;

          localStorage.setItem("token", token);
          localStorage.setItem("user", JSON.stringify(user));

          toast.success("Login successful!");
          console.log("Login Response:", response.data);
          navigate("/");
        }
      } else {
        const response = await axios.post(
          "https://ecommerce-server-0slo.onrender.com/api/auth/signup",
          { email, password, name }
        );

        if (response.status === 201) {
          const { token, user } = response.data;
          toast.success("Signup successful!");
          console.log("Sign-up Response:", response.data);
          navigate("/");
        } else {
          console.error("Registration failed");
        }
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Something went wrong. Please try again!"
      );
    }
  };

  const toggleForm = () => {
    setIsLogin(!isLogin);
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="flex flex-col sm:flex-row w-full h-full bg-white rounded-lg shadow-lg sm:p-8">
        {isLogin ? (
          <>
            <div className="flex flex-col items-center justify-center w-full  p-8 bg-white sm:w-1/2">
              <h2 className="mb-6 text-3xl sm:text-5xl font-bold text-center text-[#eda415]">
                Sign In to <br />
                Your Account
              </h2>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full sm:w-[285px]"
              >
                <div className="mb-4 w-full">
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    className="w-full bg-[#f4f8f5] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4 w-full">
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    className="w-full bg-[#f4f8f5] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
                <div className="mb-4 text-center w-full">
                  <a
                    href="#"
                    className="text-sm text-black-500 hover:underline"
                    onClick={() => alert("Forgot Password Clicked")}
                  >
                    Forgot Password?
                  </a>
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-[200.5px] px-4 py-2 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-[#eda415]"
                >
                  Sign In
                </button>
              </form>
            </div>

            <div className="flex flex-col items-center justify-center w-full p-8 text-center bg-[#003f62] text-white sm:w-1/2">
              <h1 className="mb-6 text-3xl sm:text-5xl font-bold">
                Hello, Friend!
              </h1>
              <p className="mb-8 text-md sm:text-lg">
                Enter your personal details and <br /> start your journey with
                us.
              </p>
              <button
                className="w-full sm:w-[200.5px] px-4 py-2 mt-[85px] text-blue-500 bg-white rounded-lg hover:bg-gray-200"
                onClick={toggleForm}
              >
                Sign Up
              </button>
            </div>
          </>
        ) : (
          <>
            {/* Welcome Back Section */}
            <div className="flex flex-col items-center justify-center w-full p-8 text-center bg-[#003f62] text-white sm:w-1/2">
              <h1 className="mb-4 text-3xl sm:text-5xl font-bold">
                Welcome Back!
              </h1>
              <p className="mb-6 text-md sm:text-lg">
                To keep connected with us please
                <br /> login with your personal info
              </p>
              <button
                className="w-full sm:w-[200.5px] px-6 py-2 text-blue-500 bg-white rounded-lg hover:bg-gray-200"
                onClick={toggleForm}
              >
                Sign In
              </button>
            </div>

            {/* Sign Up Section */}
            <div className="flex flex-col items-center justify-center w-full p-8 bg-white sm:w-1/2">
              <h1 className="mb-6 text-3xl sm:text-5xl font-bold text-center text-[#eda415]">
                Create Account
              </h1>
              <form
                onSubmit={handleSubmit}
                className="flex flex-col items-center w-full sm:w-[285px]"
              >
                <div className="mb-4 w-full">
                  <input
                    type="text"
                    name="name"
                    onChange={handleChange}
                    className="w-full bg-[#f4f8f5] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your name"
                  />
                </div>
                <div className="mb-4 w-full">
                  <input
                    type="email"
                    name="email"
                    onChange={handleChange}
                    className="w-full bg-[#f4f8f5] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your email"
                  />
                </div>
                <div className="mb-4 w-full">
                  <input
                    type="password"
                    name="password"
                    onChange={handleChange}
                    className="w-full bg-[#f4f8f5] px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter your password"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full sm:w-[200.5px] px-4 py-2 text-white bg-[#eda415] rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  Sign Up
                </button>
              </form>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AuthPage;
