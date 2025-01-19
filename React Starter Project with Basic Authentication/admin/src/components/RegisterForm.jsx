import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, registerUser } from "../services/authService"; // Importing service functions for user authentication
import { useAuth } from "../contexts/authContext"; // Context for managing authentication state
import googleIcon from "../assets/icons/google-icon.svg"; // Google icon for social login
import facebookIcon from "../assets/icons/facebook-icon.svg"; // Facebook icon for social login
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

function RegisterForm() {
  const navigate = useNavigate(); // Hook for programmatic navigation
  const { login } = useAuth(); // Accessing login function from Auth context
  const [email, setEmail] = useState(""); // State for email
  const [password, setPassword] = useState(""); // State for password
  const [confirmPassword, setConfirmPassword] = useState(""); // State for confirming password
  const [errors, setErrors] = useState({}); // State for form validation errors
  const [loading, setloading] = useState(false); // State for loading spinner during API calls
  const [showPassword, setShowPassword] = useState(false);

  // Centralized validation logic for each field
  const validateField = (name, value) => {
    const newErrors = { ...errors }; // Copy current errors

    switch (name) {
      case "email":
        newErrors.email =
          /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value)
            ? ""
            : "Please enter a valid email address.";
        break;

      case "password":
        newErrors.password =
          value.length >= 8 && value.length <= 20
            ? ""
            : "Password must be 8-20 characters long.";
        break;

      case "confirmPassword":
        newErrors.confirmPassword =
          value[0] === password[0] && value.length === password.length
            ? ""
            : "Passwords do not match.";
        break;

      default:
        break;
    }

    setErrors(newErrors); // Update errors state
  };

  // const isFormValid =
  //   Object.values(errors).every((error) => error === "") &&
  //   email.trim() !== "" &&
  //   password.trim() !== "" &&
  //   confirmPassword.trim() !== "";

  // Function to handle form submission for user registration
  const handleRegister = async (e) => {
    // e.preventDefault(); // Prevent default form submission
    // setErrors({}); // Clear previous errors
    setloading(true); // Start loading spinner

    try {
      // Call the register API with user details
      const registerResponse = await registerUser({
        email,
        password,
      });
      if (registerResponse.success) {
        alert(registerResponse.message); // Show success message

        // Clear form fields
        setEmail("");
        setPassword("");
        setConfirmPassword("");

        // Prompt user to sign in immediately after registration
        const signInConfirmed = window.confirm("Do you want to sign in now?");
        if (signInConfirmed) {
          const loginResponse = await loginUser({ email, password });
          if (loginResponse.success) {
            alert(loginResponse.message); // Show login success message
            login(loginResponse.data.token, loginResponse.data.role); // Save token and role
            navigate("/"); // Redirect to home page
          } else {
            setErrors({
              form: `Error ${loginResponse.status}: ${loginResponse.message}`,
            }); // Display login error
          }
        } else {
          alert("You can sign in later from the login page.");
        }
      } else {
        setErrors({
          form: `Error ${registerResponse.status}: ${registerResponse.message}`,
        }); // Display registration error
      }
    } catch (err) {
      setErrors({
        form: "An unexpected error occurred during registration. Please try again.",
      });
      console.error("Registration error:", err); // Log the error for debugging
    } finally {
      setloading(false); // Stop the loading spinner after API call
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Check if the form is valid
    const isValid =
      Object.values(errors).every((error) => error === "") &&
      email.trim() !== "" &&
      password.trim() !== "";

    if (!isValid) {
      // Find the first field with an error
      const firstErrorField = Object.keys(errors).find(
        (key) => errors[key] !== ""
      );

      // Focus on the first field with an error
      if (firstErrorField === "email") {
        const emailInput = document.querySelector("input[name='email']");
        emailInput.setAttribute("title", "Fill correctly");
        emailInput.focus();
      } else if (firstErrorField === "password") {
        const passwordInput = document.querySelector("input[name='password']");
        passwordInput.setAttribute("title", "Fill correctly");
        passwordInput.focus();
      } else if (firstErrorField === "confirmPassword") {
        const confirmPasswordInput = document.querySelector(
          "input[name='confirmPassword']"
        );
        confirmPasswordInput.setAttribute("title", "Fill correctly");
        confirmPasswordInput.focus();
      }

      // Prevent form submission
      return;
    }

    // Proceed with form submission logic
    handleRegister();
  };

  return (
    <>
      <div className="flex h-screen">
        {/* Left section with app description (hidden on small screens) */}
        <div className="hidden lg:flex bg-black text-white flex-col justify-center p-20 w-1/3">
          <h1 className="text-4xl font-bold">UISplash</h1>
          <p className="mt-4">
            Get access to 442,527 free, web UI components you can't find
            anywhere else
          </p>
        </div>

        {/* Right section with registration form (always visible) */}
        <div className="flex flex-col justify-center items-center w-full lg:w-2/3">
          <div className="w-96 max-w-lg bg-white rounded-lg overflow-hidden">
            <div className="p-8">
              {/* <!-- Header Section --> */}
              <div className="mb-8">
                {/* <!-- Back Button --> */}
                <button
                  // onClick={handleBack}
                  className="absolute top-4 left-4 p-2 bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 text-gray-600"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M15 19l-7-7 7-7"
                    />
                  </svg>
                </button>
                <h1 className="text-4xl font-semibold text-gray-900 leading-tight">
                  Create an Account
                </h1>
                <p className="text-gray-600 mt-2">
                  Already have an account?{" "}
                  <a
                    href="login"
                    className="text-blue-500 hover:underline font-medium p-1"
                  >
                    Sign In
                  </a>
                </p>
              </div>

              {/* <!-- Social Login Buttons --> */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors">
                  <img src={googleIcon} alt="Google" className="w-5 h-5 mr-4" />
                  Continue with Google
                </button>
                <button className="w-full flex items-center justify-center p-3 border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none transition-colors">
                  <img
                    src={facebookIcon}
                    alt="Facebook"
                    className="w-5 h-5 mr-4"
                  />
                  Continue with Facebook
                </button>
              </div>

              {/* <!-- Divider Section --> */}
              <div className="flex items-center my-6">
                <hr className="flex-grow border-gray-300" />
                <span className="px-2 text-sm text-gray-500">OR</span>
                <hr className="flex-grow border-gray-300" />
              </div>

              {/* Registration form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Email Input */}
                <div className="bg-white rounded-lg max-w-md mx-auto py-2">
                  <div className="relative bg-inherit">
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        validateField(e.target.name, e.target.value);
                      }}
                      name="email"
                      className="peer bg-transparent h-12 w-full rounded-lg text-gray-900 placeholder-transparent ring-2 ring-gray-300 px-4 focus:ring-sky-500 focus:outline-none focus:border-sky-600 transition-alll"
                      placeholder="Enter your email"
                      required
                    />
                    <label
                      htmlFor="email"
                      className="absolute cursor-text left-4 -top-3 text-sm text-gray-600 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                    >
                      Email
                    </label>
                    {errors.email && (
                      <div className="text-red-500 text-sm mt-1">
                        {errors.email}
                      </div>
                    )}
                  </div>
                </div>

                {/* Password Input */}
                <div className="bg-white rounded-lg max-w-md mx-auto py-2">
                  <div className="relative bg-inherit">
                    {/* Input Container */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="password"
                        value={password}
                        onChange={(e) => {
                          setPassword(e.target.value);
                          validateField(e.target.name, e.target.value);
                        }}
                        name="password"
                        className="peer bg-transparent h-12 w-full rounded-lg text-gray-900 placeholder-transparent ring-2 ring-gray-300 px-4 focus:ring-sky-500 focus:outline-none focus:border-sky-600 transition-all"
                        placeholder="Enter your password"
                        required
                      />
                      <label
                        htmlFor="password"
                        className="absolute cursor-text left-4 -top-3 text-sm text-gray-600 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                      >
                        Password
                      </label>
                      {/* Eye Icon Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {/* Error Message */}
                    {errors.password && (
                      <div className="text-red-500 text-sm mt-2">
                        {errors.password}
                      </div>
                    )}
                  </div>
                </div>

                {/* Confirm Password Input */}
                <div className="bg-white rounded-lg max-w-md mx-auto py-2">
                  <div className="relative bg-inherit">
                    {/* Input Container */}
                    <div className="relative">
                      <input
                        type={showPassword ? "text" : "password"}
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => {
                          setConfirmPassword(e.target.value);
                          validateField(e.target.name, e.target.value);
                        }}
                        name="confirmPassword"
                        className="peer bg-transparent h-12 w-full rounded-lg text-gray-900 placeholder-transparent ring-2 ring-gray-300 px-4 focus:ring-sky-500 focus:outline-none focus:border-sky-600 transition-all"
                        placeholder="Confirm your password"
                        required
                      />
                      <label
                        htmlFor="confirmPassword"
                        className="absolute cursor-text left-4 -top-3 text-sm text-gray-600 bg-white px-1 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-500 peer-placeholder-shown:top-3 peer-focus:-top-3 peer-focus:text-sky-600 peer-focus:text-sm transition-all"
                      >
                        Confirm Password
                      </label>
                      {/* Eye Icon Button */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-4 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none"
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                      >
                        {showPassword ? (
                          <EyeSlashIcon className="w-5 h-5" />
                        ) : (
                          <EyeIcon className="w-5 h-5" />
                        )}
                      </button>
                    </div>
                    {/* Error Message */}
                    {errors.confirmPassword && (
                      <div className="text-red-500 text-sm mt-2">
                        {errors.confirmPassword}
                      </div>
                    )}
                  </div>
                </div>

                {/* Register Button with Spinner */}
                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full p-3 rounded-lg focus:outline-none transition-colors flex items-center justify-center ${
                    loading
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-black hover:bg-gray-800 text-white"
                  }`}
                >
                  {loading ? (
                    <>
                      <svg
                        aria-hidden="true"
                        role="status"
                        className="inline w-5 h-5 mr-2 text-gray-200 animate-spin"
                        viewBox="0 0 100 101"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                          fill="currentColor"
                        />
                        <path
                          d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                          fill="#1C64F2"
                        />
                      </svg>
                      Loading...
                    </>
                  ) : (
                    "Register"
                  )}
                </button>
              </form>

              <p className="text-gray-600 text-center mt-4">
                By clicking continue, you agree to our{" "}
                <a href="#" className="text-black hover:underline">
                  Terms of Service
                </a>{" "}
                and{" "}
                <a href="#" className="text-black hover:underline">
                  Privacy Policy
                </a>
                .
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default RegisterForm;
