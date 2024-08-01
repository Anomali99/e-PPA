import React, { useState, useEffect, FormEvent } from "react";
import { addSppPayment } from "../api";
import Pagination from "./Pagination";

type PaymentSppType = {
  year: string;
  month: string;
  nominal_spp: number;
  nominal_kosma: number;
  spp_uuid: string;
};

type PropsType = {
  data: PaymentSppType[];
};

const PaymentSpp: React.FC<PropsType> = ({ data }) => {
  const [payment, setPayment] = useState<PaymentSppType[]>([]);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [year, setyear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [nominalSpp, setNominalSpp] = useState<number>(0);
  const [nominalKosma, setNominalKosma] = useState<number>(0);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [accessLevel, setAccessLevel] = useState<string>("");

  const max = 12;

  useEffect(() => {
    let access_level = localStorage.getItem("access_level") || "4";
    setAccessLevel(access_level);
    setPayment(data);
    let size = data.length || 0;
    let hasilPembagian = size / max;
    setMaxPage(Math.ceil(hasilPembagian || 0 / max));
  }, [data]);

  const hendelSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await addSppPayment({
      month,
      nominal_spp: nominalSpp,
      nominal_kosma: nominalKosma,
      year,
    });

    window.location.reload();
  };

  const getPaymentSize = (): PaymentSppType[] => {
    const end = page * max;
    const start = end - max;

    return payment.slice(start, end);
  };

  return (
    <div className="w-full h-full p-4 flex justify-center flex-col gap-3 md:gap-6">
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-[8px] md:text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                SPP UUID
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                year
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                month
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                nominal spp
              </th>
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                nominal kosma
              </th>
            </tr>
          </thead>
          <tbody className="text-[8px] text-nowrap md:text-wrap md:text-xs">
            {getPaymentSize().map((item) => (
              <tr
                key={item.spp_uuid}
                className="border-b cursor-pointer odd:bg-white even:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {item.spp_uuid}
                </th>
                <td className="px-6 py-4">{item.year}</td>
                <td className="px-6 py-4 capitalize">{item.month}</td>
                <td className="px-6 py-4">
                  {item.nominal_spp.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
                <td className="px-6 py-4">
                  {item.nominal_kosma.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <Pagination page={page} max={maxPage} setCurrent={setPage} />
        <div className="w-full flex justify-end">
          {["1", "2", "3"].includes(accessLevel) ? (
            <button
              className="relative h-max inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:outline-none"
              onClick={() => setIsOpen(true)}
            >
              <span className="relative flex items-center px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <svg
                  className="size-4 md:size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                >
                  <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                </svg>
                Tambah
              </span>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
      {isOpen ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black opacity-50"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg z-10">
            <div className="flex items-center justify-between p-4 border-b rounded-t">
              <h3 className="text-lg font-semibold text-gray-900">
                Tambah SPP
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
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

            <form className="p-4" onSubmit={hendelSubmit}>
              <div className="grid gap-4 mb-4 grid-cols-2">
                <div className="col-span-2">
                  <label
                    htmlFor="year"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Year
                  </label>
                  <input
                    type="text"
                    name="year"
                    id="year"
                    inputMode="numeric"
                    value={year}
                    onChange={(e) => setyear(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="mont"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Month
                  </label>
                  <select
                    id="school"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Month --
                    </option>
                    <option value="januari">Januari</option>
                    <option value="februari">Februari</option>
                    <option value="maret">Maret</option>
                    <option value="april">April</option>
                    <option value="mei">Mei</option>
                    <option value="juni">Juni</option>
                    <option value="juli">Juli</option>
                    <option value="agustus">Agustus</option>
                    <option value="september">September</option>
                    <option value="oktober">Oktober</option>
                    <option value="november">November</option>
                    <option value="desember">Desember</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="nominal"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Nominal SPP
                  </label>
                  <input
                    type="text"
                    name="nominal"
                    id="nominal"
                    inputMode="numeric"
                    value={nominalSpp.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setNominalSpp(value === "" ? 0 : parseInt(value));
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="nominal2"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Nominal Kosma
                  </label>
                  <input
                    type="text"
                    name="nominal2"
                    id="nominal2"
                    inputMode="numeric"
                    value={nominalKosma.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                      minimumFractionDigits: 0,
                    })}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "");
                      setNominalKosma(value === "" ? 0 : parseInt(value));
                    }}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
              </div>
              <button
                type="submit"
                className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Tambah
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="ml-6 text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default PaymentSpp;
