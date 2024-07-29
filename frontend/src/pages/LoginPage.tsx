import React, { FormEvent, useState } from "react";
import { useAuth } from "../router/middleware";
import { login } from "../api";
import { Modal } from "../components";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDanger, setIsDanger] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const { login: setLogin } = useAuth();

  const loginHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await login({ username, password });
    if (response.message == "login success") {
      // setIsDanger(false);
      setLogin(
        response.data?.username || "",
        response.data?.user_uuid || "",
        response.data?.token || ""
      );
    } else {
      setMessage(response.message);
      setIsDanger(true);
      setIsOpen(true);
    }
    setUsername("");
    setPassword("");
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="flex w-1/2 h-max bg-white rounded-lg shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div className="hidden lg:block lg:w-1/2 bg-cover bg-[url(https://images.unsplash.com/photo-1546514714-df0ccc50d7bf?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=667&q=80)]"></div>
        <form onSubmit={loginHandle} className="w-full p-8 lg:w-1/2">
          <h2 className="text-2xl font-semibold text-gray-700 text-center">
            e-PPA
          </h2>
          <p className="text-xl text-gray-600 text-center">Welcome back!</p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Password
            </label>
            <input
              className="bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="mt-8">
            <button
              className="bg-gray-700 text-white font-bold py-2 px-4 w-full rounded hover:bg-gray-600"
              type="submit"
            >
              Login
            </button>
          </div>
        </form>
      </div>
      <Modal
        isOpen={isOpen}
        danger={isDanger}
        message={message}
        onClose={() => setIsOpen(false)}
      />
    </div>
  );
};

export default LoginPage;
