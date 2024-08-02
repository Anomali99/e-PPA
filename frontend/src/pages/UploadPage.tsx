import React, { useEffect, useState } from "react";
import { API_BASE_URL, getUploadImage } from "../api";

type UploadType = {
  filename: string;
  datetime: string;
  name: string;
  nis: string;
  address: string;
  parent: string;
  gender: string;
  school_name: string;
};

const UploadPage: React.FC = () => {
  const [data, setData] = useState<UploadType[]>([]);
  const [current, setCurrent] = useState<UploadType | null>(null);
  const [date, setDate] = useState<string>("");

  useEffect(() => {
    const getData = async () => {
      const res = await getUploadImage();
      const value = res.data || [];
      setData(value);
      if (value.length !== 0) {
        const dateString = value[value.length - 1].datetime;
        const [day, month, year] = dateString.split("-");
        setDate(`${year}-${month}-${day}`);
      }
    };

    getData();
    console.log(date);
  }, []);

  const filterData = (): UploadType[] => {
    return data.filter((item) => {
      const dateString = item.datetime;
      const [day, month, year] = dateString.split("-");
      return `${year}-${month}-${day}` === date;
    });
  };

  return (
    <div className="w-full p-6">
      <div className="w-full flex flex-row justify-between mb-4 items-center">
        <h1 className="text-sm md:text-xl font-bold flex flex-row gap-4 items-center">
          <a href="/dashboard">
            <svg
              className="size-5 md:size-10 hover:scale-110 hover:text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </a>
          <span>Bukti Transfer</span>
        </h1>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-1.5 items-center">
          <h1 className="text-xs md:text-normal font-bold text-right">
            Tanggal:{" "}
          </h1>
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="text-xs md:text-normal bg-gray-50 border border-gray-300 text-gray-900 md:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-max p-1 md:p-2.5"
          />
        </div>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-[8px] md:text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                Name
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                NIS
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                School Name
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                Address
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                Parent
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                Gender
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                Datetime
              </th>
            </tr>
          </thead>
          <tbody className="text-[8px] text-nowrap md:text-wrap md:text-xs">
            {filterData().map((item, index) => (
              <tr
                key={index}
                onClick={() => setCurrent(item)}
                className="border-b cursor-pointer odd:bg-white even:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {item.name}
                </th>
                <td className="px-6 py-4">{item.nis}</td>
                <td className="px-6 py-4">{item.school_name}</td>
                <td className="px-6 py-4">{item.address}</td>
                <td className="px-6 py-4">{item.parent}</td>
                <td className="px-6 py-4 capitalize">{item.gender}</td>
                <td className="px-6 py-4">{item.datetime}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {current !== null ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setCurrent(null)}
          ></div>
          <div className="relative p-4 w-full max-w-screen-lg max-h-full bg-white rounded-lg shadow-lg z-10">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Bukti Transfer
              </h3>
              <button
                type="button"
                onClick={() => setCurrent(null)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
                aria-label="Close modal"
              >
                <svg
                  className="w-3 h-3"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 14 14"
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                  />
                </svg>
              </button>
            </div>
            <div className="w-full flex flex-col md:flex-row gap-4 mt-4 px-2">
              <div className="w-full">
                <a
                  className="w-full"
                  href={API_BASE_URL + current.filename}
                  target="_blank"
                >
                  <img
                    className="object-cover object-center h-full max-h-[70vh] bg-slate-500 border-slate-500 border-solid border-2"
                    src={API_BASE_URL + current.filename}
                    alt=" img"
                  />
                </a>
              </div>
              <div className="w-full md:w-5/12">
                <div className="grid gap-4 mb-4 grid-cols-2">
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-1 text-[10px] md:text-sm font-medium text-gray-900"
                    >
                      Name
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={current.name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[10px] md:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 md:p-2.5"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="name"
                      className="block mb-1 text-[10px] md:text-sm font-medium text-gray-900"
                    >
                      NIS
                    </label>
                    <input
                      type="text"
                      id="name"
                      value={current.name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[10px] md:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 md:p-2.5"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="school"
                      className="block mb-1 text-[10px] md:text-sm font-medium text-gray-900"
                    >
                      School Name
                    </label>
                    <input
                      type="text"
                      id="school"
                      value={current.school_name}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[10px] md:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 md:p-2.5"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="address"
                      className="block mb-1 text-[10px] md:text-sm font-medium text-gray-900"
                    >
                      Address
                    </label>
                    <input
                      type="text"
                      id="address"
                      value={current.address}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[10px] md:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 md:p-2.5"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="parent"
                      className="block mb-1 text-[10px] md:text-sm font-medium text-gray-900"
                    >
                      Parent
                    </label>
                    <input
                      type="text"
                      id="parent"
                      value={current.parent}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[10px] md:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 md:p-2.5"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="gender"
                      className="block mb-1 text-[10px] md:text-sm font-medium text-gray-900"
                    >
                      Gender
                    </label>
                    <input
                      type="text"
                      id="gender"
                      value={current.gender}
                      className="bg-gray-50 border capitalize border-gray-300 text-gray-900 text-[10px] md:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 md:p-2.5"
                      disabled
                    />
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="datetime"
                      className="block mb-1 text-[10px] md:text-sm font-medium text-gray-900"
                    >
                      Datetime
                    </label>
                    <input
                      type="text"
                      id="datetime"
                      value={current.datetime}
                      className="bg-gray-50 border border-gray-300 text-gray-900 text-[10px] md:text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-1 md:p-2.5"
                      disabled
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default UploadPage;
