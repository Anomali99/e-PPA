import React, { useState, useEffect, useRef } from "react";
import { addSppSantri } from "../api";
import Pagination from "./Pagination";
import { useReactToPrint } from "react-to-print";
import PaymentSantriPrint from "./PaymentSantriPrint";
import Modal from "./Modal";

type SppType = {
  spp_uuid: string;
  year: string;
  month: string;
  total: number;
  spp_santri_uuid: string;
  santri_uuid?: string;
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
  santri: string;
};

type SppSantriType = {
  santri_uuid: string;
  spp_uuid: string;
  spp_santri_uuid: string;
  delete: boolean;
};

type DeleteSpp = {
  spp_santri_uuid: string;
  delete: boolean;
};

const PaymentPutra: React.FC<PropsType> = (props) => {
  const [payment, setPayment] = useState<PaymentSantriType[]>([]);
  const [paymentSpp, setPaymentSpp] = useState<PaymentSppType[]>([]);
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [deleteSpp, setDeleteSpp] = useState<DeleteSpp[]>([]);
  const [current, setCurrent] = useState<SppType | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [maxPage, setMaxPage] = useState<number>(1);
  const [month, setMonth] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const [year, setYear] = useState<string>("");

  const max = 12;

  useEffect(() => {
    const getData = async () => {
      let access_level = localStorage.getItem("access_level") || "4";
      await setAccessLevel(access_level);
      await setPayment(props.data);
      await setPaymentSpp(props.spp);
      let getyear = Object.keys(getYearUniqe());
      setYear(getyear[getyear.length - 1]);
      let size = props.data.length || 0;
      let hasilPembagian = size / max;
      setMaxPage(Math.ceil(hasilPembagian || 0 / max));
    };

    getData();
  }, [props]);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Cetak data",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });

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

  const handleCheckbox = (
    santriUuid: string,
    sppData: SppType,
    checked: boolean
  ) => {
    if (checked) {
      setDeleteSpp((prev) =>
        prev.filter((item) => item.spp_santri_uuid !== sppData.spp_santri_uuid)
      );
    } else {
      setCurrent({ ...sppData, santri_uuid: santriUuid });
      setIsOpen(true);
    }
  };

  const isCecked = (sppData: SppType): boolean => {
    if (sppData.spp_santri_uuid === "") return false;
    if (sppData.spp_santri_uuid === null) return false;
    if (
      deleteSpp.some((item) => item.spp_santri_uuid === sppData.spp_santri_uuid)
    ) {
      return false;
    }
    return true;
  };

  const submitHandle = async () => {
    const spp_santri: SppSantriType[] = [];
    payment.forEach((item) => {
      const santri_uuid = item.santri_uuid;
      item.spp.forEach((value) => {
        const spp_santri_uuid = value.spp_santri_uuid;
        const spp_delete = deleteSpp.find(
          (atributs) => atributs.spp_santri_uuid === spp_santri_uuid
        )?.delete;
        if (spp_santri_uuid !== "" && spp_santri_uuid !== null) {
          spp_santri.push({
            santri_uuid,
            spp_santri_uuid,
            spp_uuid: value.spp_uuid,
            delete: spp_delete || false,
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

  const yesHandle = () => {
    setIsOpen(false);
    const newDeleteSpp = [
      ...deleteSpp,
      {
        delete: true,
        spp_santri_uuid: current?.spp_santri_uuid || "",
      },
    ];
    setDeleteSpp(newDeleteSpp);
    setCurrent(null);
  };

  return (
    <>
      <PaymentSantriPrint
        ref={componentRef}
        data={payment}
        santri={props.santri}
      />
      <div className="w-full flex flex-row gap-4 justify-between md:justify-end items-center mb-4">
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-1.5 items-center">
          <h1 className="text-xs md:text-normal font-bold ">Triwulan: </h1>
          <div className="flex flex-row gap-4">
            <button
              className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
                month === 1
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setMonth(1)}
            >
              1
            </button>
            <button
              className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
                month === 2
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setMonth(2)}
            >
              2
            </button>
            <button
              className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
                month === 3
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setMonth(3)}
            >
              3
            </button>
            <button
              className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
                month === 4
                  ? "bg-gray-500 cursor-not-allowed"
                  : "bg-gray-300 hover:bg-gray-400"
              }`}
              onClick={() => setMonth(4)}
            >
              4
            </button>
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-x-4 gap-y-1.5 items-center">
          <h1 className="text-xs md:text-normal font-bold text-right">
            Tahun:{" "}
          </h1>
          <select
            value={year}
            onChange={(e) => setYear(e.target.value)}
            className="text-xs md:text-normal bg-gray-50 border border-gray-300 text-gray-900 md:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-max p-1 md:p-2.5"
          >
            {Object.keys(getYearUniqe()).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
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
              {getPayment().map((item) => (
                <th
                  key={item.spp_uuid}
                  scope="col"
                  className="text-center md:text-left md:px-6 md:py-3"
                >
                  {item.month + " " + item.year}
                </th>
              ))}
              <th
                scope="col"
                className="text-center md:text-left md:px-6 md:py-3"
              >
                Total
              </th>
            </tr>
          </thead>
          <tbody className="text-[8px] text-nowrap md:text-wrap md:text-xs">
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
                      checked={isCecked(value)}
                      onChange={(e) =>
                        disabledHandle(value)
                          ? handleCheckboxChange(
                              item.santri_uuid,
                              value.spp_uuid,
                              e.target.checked
                            )
                          : handleCheckbox(
                              item.santri_uuid,
                              value,
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
      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2 mt-2 md:mt-4">
        <Pagination page={page} max={maxPage} setCurrent={setPage} />
        <div className="w-full flex justify-end">
          {["1", "2", "3"].includes(accessLevel) ? (
            <button
              className="relative h-max inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:outline-none"
              onClick={submitHandle}
            >
              <span className="relative flex items-center px-2 md:px-5 py-1.5 md:py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <svg
                  className="size-4 md:size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
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
          <button
            className="relative inline-flex items-center h-max justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-600 to-yellow-500 group-hover:from-green-600 group-hover:to-yellow-500 hover:text-white focus:outline-none"
            onClick={handlePrint}
          >
            <span className="relative flex items-center px-2 md:px-5 py-1.5 md:py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
              <svg
                className="size-4 md:size-6"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 -960 960 960"
                fill="currentColor"
              >
                <path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" />
              </svg>
              Print
            </span>
          </button>
        </div>
        <Modal
          message="Apakah andah yakin ingin merubah data ini ?"
          danger={true}
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          onYes={yesHandle}
        />
      </div>
    </>
  );
};

export default PaymentPutra;
