import Navbar from "../components/Navbar";

const UserPage = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen flex flex-col items-center justify-center bg-yellow-100 p-8">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          If you are in this page you are a user
        </h1>
        <p className="text-lg text-gray-700 mb-8">
          becauase this page is restricted for users.
        </p>
        <div className="flex space-x-4"></div>
      </div>
    </>
  );
};

export default UserPage;
