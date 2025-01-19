import { useAuth } from "../contexts/authContext";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

const Home = () => {
  const { isAuthenticated, userRole } = useAuth(); // Destructure values from context

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-green-100">
        <h1 className="text-4xl font-extrabold text-green-800 mb-4 text-center">
          Welcome to Green Harvest System
        </h1>

        {isAuthenticated ? (
          <>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Hello, {userRole}! You are logged in.
            </p>
          </>
        ) : (
          <>
            <p className="text-lg text-gray-700 mb-8 text-center">
              Please{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                log in
              </Link>{" "}
              to access full features.
            </p>
            <Link
              to="/register"
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Register
            </Link>
          </>
        )}
      </div>
    </>
  );
};

export default Home;
