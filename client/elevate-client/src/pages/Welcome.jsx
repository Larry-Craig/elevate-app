 import { Link } from "react-router-dom";

export default function Welcome() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 px-4 text-center">
      <h1 className="text-4xl font-bold text-blue-800 mb-6">Welcome to Elevate</h1>
      <p className="text-lg mb-8 text-gray-700">Find jobs or hire top talent with ease.</p>
      <div className="flex gap-4">
        <Link
          to="/signup"
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          Sign Up
        </Link>
        <Link
          to="/login"
          className="bg-gray-200 text-gray-800 px-6 py-2 rounded hover:bg-gray-300"
        >
          Login
        </Link>
      </div>
    </div>
  );
}

