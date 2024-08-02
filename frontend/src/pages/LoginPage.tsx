import React, { FormEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../router/middleware";
import { login } from "../api";
import { Modal } from "../components";
import { pondok } from "../assets";

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [isDanger, setIsDanger] = useState<boolean>(true);
  const [message, setMessage] = useState<string>("");
  const { login: setLogin } = useAuth();
  const navigate = useNavigate();

  const loginHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const response = await login({ username, password });
    setMessage(response.message);
    if (response.message === "login success") {
      setLogin(
        response.data?.username || "",
        response.data?.user_uuid || "",
        response.data?.token || ""
      );
      setIsDanger(false);
    } else {
      setIsDanger(true);
    }
    setIsOpen(true);
    setUsername("");
    setPassword("");
  };

  const closeHandle = () => {
    setIsOpen(false);
    if (message === "login success") {
      navigate("/dashboard");
    }
  };

  return (
    <div className="w-screen h-screen bg-gray-200 flex justify-center items-center">
      <div className="flex w-full md:w-1/2 h-max md:bg-white rounded-lg md:shadow-lg overflow-hidden mx-auto max-w-sm lg:max-w-4xl">
        <div
          className="hidden lg:block lg:w-1/2 bg-cover bg-center"
          style={{ backgroundImage: `url(${pondok})` }}
        ></div>
        <form onSubmit={loginHandle} className="w-full p-8 lg:w-1/2">
          <img
            src="/icon_app.png"
            alt="asyafi'iyah"
            className="object-scale-down object-center w-full h-28"
          />
          <h2 className="text-xl md:text-2xl font-semibold text-gray-700 text-center">
            Assyafi'iyah
          </h2>
          <p className="text-sm md:text-xl text-gray-600 text-center">
            Bungah Gresik
          </p>
          <div className="mt-4">
            <label className="block text-gray-700 text-sm font-bold mb-2">
              Username
            </label>
            <input
              className="md:bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
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
              className="md:bg-gray-200 text-gray-700 focus:outline-none focus:shadow-outline border border-gray-300 rounded py-2 px-4 block w-full appearance-none"
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
        onClose={closeHandle}
      />
    </div>
  );
};

export default LoginPage;
