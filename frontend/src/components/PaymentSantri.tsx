import React, { useState, useEffect } from "react";
import { addSppSantri } from "../api";
import Pagination from "./Pagination";

type SppType = {
  spp_uuid: string;
  year: string;
  month: string;
  total: number;
  spp_santri_uuid: string;
};

type PaymentSantriType = {
  santri_uuid: string;
  name: string;
  gender: string;
  total: number;
  spp: SppType[];
};

type PaymentSppType = {
  year: string;
  month: string;
  nominal_spp: number;
  nominal_kosma: number;
  spp_uuid: string;
};

type PropsType = {
  data: PaymentSantriType[];
  spp: PaymentSppType[];
};

type SppSantriType = {
  santri_uuid: string;
  spp_uuid: string;
  spp_santri_uuid: string;
};

const PaymentPutra: React.FC<PropsType> = ({ data, spp }) => {
  const [payment, setPayment] = useState<PaymentSantriType[]>([]);
  const [paymentSpp, setPaymentSpp] = useState<PaymentSppType[]>([]);
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [accessLevel, setAccessLevel] = useState<string>("");

  const max = 12;

  useEffect(() => {
    let access_level = localStorage.getItem("access_level") || "4";
    setAccessLevel(access_level);
    setPayment(data);
    setPaymentSpp(spp);
    let getyear = Object.keys(getYearUniqe());
    setYear(getyear[getyear.length - 1]);
    let size = data.length || 0;
    let hasilPembagian = size / max;
    setMaxPage(Math.ceil(hasilPembagian || 0 / max));
  }, [data, spp]);

  const handleCheckboxChange = (
    santriUuid: string,
    sppUuid: string,
    checked: boolean
  ) => {
    setPayment((prevPayments) =>
      prevPayments.map((payment) =>
        payment.santri_uuid === santriUuid
          ? {
              ...payment,
              spp: payment.spp.map((spp) =>
                spp.spp_uuid === sppUuid
                  ? {
                      ...spp,
                      spp_santri_uuid: !checked
                        ? spp.spp_santri_uuid === spp.spp_uuid
                          ? ""
                          : spp.spp_santri_uuid
                        : sppUuid,
                    }
                  : spp
              ),
            }
          : payment
      )
    );
  };

  const submitHandle = async () => {
    const spp_santri: SppSantriType[] = [];
    payment.forEach((item) => {
      const santri_uuid = item.santri_uuid;
      item.spp.forEach((value) => {
        const spp_santri_uuid = value.spp_santri_uuid;
        if (spp_santri_uuid !== "" && spp_santri_uuid !== null) {
          spp_santri.push({
            santri_uuid,
            spp_santri_uuid,
            spp_uuid: value.spp_uuid,
          });
        }
      });
    });
    await addSppSantri(spp_santri);
    window.location.reload();
  };

  const disabledHandle = (value: SppType): boolean => {
    if (value.spp_santri_uuid === value.spp_uuid) {
      return false;
    }
    if (value.spp_santri_uuid === "" || value.spp_santri_uuid === null) {
      return false;
    }

    return true;
  };

  const getMonth = (): string[] => {
    switch (month) {
      case 1:
        return ["januari", "februari", "maret"];
      case 2:
        return ["april", "mei", "juni"];
      case 3:
        return ["juli", "agustus", "september"];
      case 4:
        return ["oktober", "november", "desember"];
      default:
        return [];
    }
  };

  const getSantriPayment = (thisSpp: SppType[]): SppType[] => {
    let bualan = getMonth();
    let filterYear = thisSpp.filter((item) => {
      return item.year === year;
    });
    let newPayment = filterYear.filter((item) => {
      return bualan.includes(item.month.toLowerCase());
    });
    return newPayment;
  };

  const getPayment = (): PaymentSppType[] => {
    let bualan = getMonth();
    let filterYear = paymentSpp.filter((item) => {
      return item.year === year;
    });
    let newPayment = filterYear.filter((item) => {
      return bualan.includes(item.month.toLowerCase());
    });
    return newPayment;
  };

  const getYearUniqe = (): Record<string, number> => {
    return paymentSpp.reduce((acc, item) => {
      if (!acc[item.year]) {
        acc[item.year] = 1;
      } else {
        acc[item.year]++;
      }
      return acc;
    }, {} as Record<string, number>);
  };

  const getPaymentSize = (): PaymentSantriType[] => {
    const end = page * max;
    const start = end - max;

    return payment.slice(start, end);
  };

  return (
    <>
      <div className="w-full flex flex-row gap-4 justify-end items-center mb-4">
        <h1 className=" font-bold ">Triwulan: </h1>
        <button
          className={` px-4 py-2 text-white font-bold rounded-lg ${
            month === 1
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setMonth(1)}
        >
          1
        </button>
        <button
          className={` px-4 py-2 text-white font-bold rounded-lg ${
            month === 2
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setMonth(2)}
        >
          2
        </button>
        <button
          className={` px-4 py-2 text-white font-bold rounded-lg ${
            month === 3
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setMonth(3)}
        >
          3
        </button>
        <button
          className={` px-4 py-2 text-white font-bold rounded-lg ${
            month === 4
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-gray-300 hover:bg-gray-400"
          }`}
          onClick={() => setMonth(4)}
        >
          4
        </button>
        <h1 className=" font-bold ">Tahun: </h1>
        <select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-max p-2.5"
        >
          {Object.keys(getYearUniqe()).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left rtl:text-right text-gray-500">
          <thead className="text-xs text-gray-700 uppercase bg-gray-200">
            <tr>
              <th scope="col" className="px-6 py-3">
                Name
              </th>
              {getPayment().map((item) => (
                <th key={item.spp_uuid} scope="col" className="px-6 py-3">
                  {item.month + " " + item.year}
                </th>
              ))}
              <th scope="col" className="px-6 py-3">
                Total
              </th>
            </tr>
          </thead>
          <tbody>
            {getPaymentSize().map((item) => (
              <tr
                key={item.santri_uuid}
                className="border-b cursor-pointer odd:bg-white even:bg-gray-50"
              >
                <th
                  scope="row"
                  className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                >
                  {item.name}
                </th>
                {getSantriPayment(item.spp).map((value) => (
                  <td key={value.spp_uuid} className="px-6 py-4">
                    <input
                      id={`checkbox-${value.spp_uuid}`}
                      type="checkbox"
                      disabled={disabledHandle(value)}
                      checked={value.spp_santri_uuid !== ""}
                      onChange={(e) =>
                        handleCheckboxChange(
                          item.santri_uuid,
                          value.spp_uuid,
                          e.target.checked
                        )
                      }
                    />
                    <label
                      htmlFor={`checkbox-${value.spp_uuid}`}
                      className="ml-1"
                    >
                      {value.total.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </label>
                  </td>
                ))}
                <td className="px-6 py-4 uppercase">
                  {item.total.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex justify-end mt-4">
        <Pagination page={page} max={maxPage} setCurrent={setPage} />
        <div className="w-full flex justify-end">
          {["1", "2", "3"].includes(accessLevel) ? (
            <button
              className="relative inline-flex items-center justify-center p-0.5 mb-2 overflow-hidden text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:outline-none"
              onClick={submitHandle}
            >
              <span className="relative flex items-center px-5 py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="M840-680v480q0 33-23.5 56.5T760-120H200q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h480l160 160Zm-80 34L646-760H200v560h560v-446ZM480-240q50 0 85-35t35-85q0-50-35-85t-85-35q-50 0-85 35t-35 85q0 50 35 85t85 35ZM240-560h360v-160H240v160Zm-40-86v446-560 114Z" />
                </svg>
                Simpan
              </span>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>
    </>
  );
};

export default PaymentPutra;
