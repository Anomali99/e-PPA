import React, { useState, useEffect } from "react";
import { getAll } from "../api";
import { useAuth } from "../router/middleware";

const DashboardPage: React.FC = () => {
  const [time, setTime] = useState<string>(new Date().toLocaleTimeString());
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [putra, setPutra] = useState<number>(0);
  const [putri, setPutri] = useState<number>(0);
  const [sekolah, setSekolah] = useState<number>(0);
  const { logout } = useAuth();

  useEffect(() => {
    const timerId = setInterval(() => {
      setTime(new Date().toLocaleTimeString());
    }, 1000);

    const getData = async () => {
      const response = await getAll();
      setPutra(response.data?.putra || 0);
      setPutri(response.data?.putri || 0);
      setSekolah(response.data?.sekolah || 0);
    };
    getData();
    const access_level = localStorage.getItem("access_level") || "4";
    setAccessLevel(access_level);
    return () => clearInterval(timerId);
  }, []);

  return (
    <div className="bg-gray-200 min-h-screen">
      <div className="flex  py-12 px-10">
        <div className="w-full flex flex-col gap-6">
          <div className="flex flex-row gap-3">
            <div className="bg-no-repeat bg-red-200 border border-red-300 rounded-xl w-7/12 mr-2 p-6">
              <div className="flex flex-row justify-between">
                <p className="text-5xl text-indigo-900 capitalize">
                  Welcome <br />
                  <strong>{localStorage.getItem("username")}</strong>
                </p>
                <svg
                  className="size-24 text-red-400 mr-4 cursor-pointer hover:text-red-500"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                  onClick={logout}
                >
                  <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h280v80H200Zm440-160-55-58 102-102H360v-80h327L585-622l55-58 200 200-200 200Z" />
                </svg>
              </div>
              <span className="bg-red-300 text-xl text-white inline-block rounded-full mt-12 px-8 py-2">
                <strong>{time}</strong>
              </span>
            </div>

            <div className="bg-no-repeat bg-orange-200 border flex flex-col justify-between border-orange-300 rounded-xl w-5/12 ml-2 p-6">
              <p className="text-7xl text-indigo-900">Santri</p>
              <p className="self-end text-7xl text-indigo-900 font-bold">
                {putra + putri}
              </p>
            </div>
          </div>

          <div className="flex flex-row h-64 gap-6">
            <div
              className={`bg-white rounded-xl shadow-lg px-6 py-4 w-4/12 ${
                accessLevel === "2" ? "cursor-not-allowed" : "hover:bg-gray-400"
              }`}
            >
              <a
                className={`w-full h-full flex flex-col justify-between ${
                  accessLevel === "2" ? "cursor-not-allowed" : ""
                }`}
                href={accessLevel === "2" ? "" : "/putri"}
              >
                <div className="w-full flex items-center">
                  <svg
                    className="size-24 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M400-80v-240H280l122-308q10-24 31-38t47-14q26 0 47 14t31 38l122 308H560v240H400Zm80-640q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720Z" />
                  </svg>
                  <p className="text-gray-600 text-6xl">Putri</p>
                </div>
                <p className="text-gray-600 text-6xl font-bold self-end">
                  {putri}
                </p>
              </a>
            </div>
            <div
              className={`bg-white rounded-xl shadow-lg px-6 py-4 w-4/12 ${
                accessLevel === "3" ? "cursor-not-allowed" : "hover:bg-gray-400"
              }`}
            >
              <a
                className={`w-full h-full flex flex-col justify-between ${
                  accessLevel === "3" ? "cursor-not-allowed" : ""
                }`}
                href={accessLevel === "3" ? "" : "/putra"}
              >
                <div className="w-full flex items-center">
                  <svg
                    className="size-24 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M400-80v-280h-80v-240q0-33 23.5-56.5T400-680h160q33 0 56.5 23.5T640-600v240h-80v280H400Zm80-640q-33 0-56.5-23.5T400-800q0-33 23.5-56.5T480-880q33 0 56.5 23.5T560-800q0 33-23.5 56.5T480-720Z" />
                  </svg>
                  <p className="text-gray-600 text-6xl">Putra</p>
                </div>
                <p className="text-gray-600 text-6xl font-bold self-end">
                  {putra}
                </p>
              </a>
            </div>
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 w-4/12 hover:bg-gray-400">
              <a
                className="w-full h-full flex flex-col justify-between"
                href="/school"
              >
                <div className="w-full flex items-center">
                  <svg
                    className="size-24 text-gray-600"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 -960 960 960"
                    fill="currentColor"
                  >
                    <path d="M480-120 200-272v-240L40-600l440-240 440 240v320h-80v-276l-80 44v240L480-120Zm0-332 274-148-274-148-274 148 274 148Zm0 241 200-108v-151L480-360 280-470v151l200 108Zm0-241Zm0 90Zm0 0Z" />
                  </svg>
                  <p className="text-gray-600 text-6xl ml-4">Sekolah</p>
                </div>
                <p className="text-gray-600 text-6xl font-bold self-end">
                  {sekolah}
                </p>
              </a>
            </div>
          </div>
          <div className="w-full flex flex-row gap-6">
            <div className="bg-white rounded-xl flex flex-col justify-between shadow-lg px-6 h-64 py-4 w-1/2 hover:bg-gray-400">
              <a className="w-full h-full" href="/payment">
                <div className="w-full flex items-center flex-row justify-between">
                  <svg
                    className="size-52 text-gray-600 mr-4"
                    version="1.1"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 502.685 502.685"
                    fill="currentColor"
                  >
                    <path
                      d="M482.797,276.924c4.53-5.824,6.73-13.331,4.724-20.988L428.05,30.521
        c-3.451-13.029-16.847-20.837-29.854-17.386L18.184,113.331C5.22,116.761-2.61,130.2,0.798,143.207L60.269,368.6
        c3.408,13.007,16.868,20.816,29.876,17.408l134.278-35.419v75.476c0,42.214,69.954,64.303,139.11,64.303
        c69.113,0,139.153-22.089,139.153-64.302V311.61C502.685,297.869,495.157,286.307,482.797,276.924z M439.763,199.226l6.212,23.469
        l-75.541,19.953l-6.169-23.512L439.763,199.226z M395.931,50.733l11.799,44.695l-118.014,31.148l-11.799-44.695L395.931,50.733z
        M342.975,224.744l6.04,22.951c-27.934,1.251-55.113,6.126-76.943,14.452l-4.616-17.429L342.975,224.744z M79.984,319.224
        l-6.169-23.426l75.519-19.975l6.212,23.555L79.984,319.224z M170.625,270.237l75.476-19.953l5.716,21.506
        c-1.834,1.122-3.559,2.286-5.242,3.473l-69.781,18.421L170.625,270.237z M477.491,424.209c0,24.612-50.993,44.544-113.958,44.544
        c-62.9,0-113.937-19.953-113.937-44.544v-27.718c0-0.928,0.539-1.769,0.69-2.653c3.602,23.34,52.654,41.847,113.247,41.847
        c60.614,0,109.687-18.508,113.268-41.847c0.151,0.884,0.69,1.726,0.69,2.653V424.209z M477.491,369.678
        c0,24.591-50.993,44.522-113.958,44.522c-62.9,0-113.937-19.931-113.937-44.522V341.96c0-0.906,0.539-1.769,0.69-2.653
        c3.602,23.318,52.654,41.869,113.247,41.869c60.614,0,109.687-18.551,113.268-41.869c0.151,0.884,0.69,1.747,0.69,2.653V369.678z
        M363.532,356.11c-62.9,0-113.937-19.931-113.937-44.501c0-24.569,51.036-44.5,113.937-44.5c62.965,0,113.958,19.931,113.958,44.5
        C477.491,336.179,426.497,356.11,363.532,356.11z"
                    />
                  </svg>
                  <p className="text-gray-600 text-8xl mr-4 font-bold">
                    Payment
                  </p>
                </div>
              </a>
            </div>
            {["1", "2", "3"].includes(accessLevel) ? (
              <div className="bg-white rounded-xl flex flex-col justify-between shadow-lg px-6 h-64 py-4 w-1/2 hover:bg-gray-400">
                <a className="w-full h-full" href="/transfer">
                  <div className="w-full flex items-center flex-row justify-between">
                    <svg
                      className="size-52 text-gray-600 mr-4"
                      version="1.1"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 -960 960 960"
                      fill="currentColor"
                    >
                      <path d="M440-200h80v-167l64 64 56-57-160-160-160 160 57 56 63-63v167ZM240-80q-33 0-56.5-23.5T160-160v-640q0-33 23.5-56.5T240-880h320l240 240v480q0 33-23.5 56.5T720-80H240Zm280-520v-200H240v640h480v-440H520ZM240-800v200-200 640-640Z" />
                    </svg>
                    <p className="text-gray-600 text-8xl mr-4 font-bold">
                      Transfer
                    </p>
                  </div>
                </a>
              </div>
            ) : (
              <div className="bg-blue-200 rounded-xl flex justify-center items-center shadow-lg px-6 h-64 py-4 w-1/2 ">
                <h1 className="bg-blue-300 text-white inline-block rounded-full px-8 py-5 w-max text-5xl font-bold">
                  {new Date().toLocaleDateString("id")}
                </h1>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;
