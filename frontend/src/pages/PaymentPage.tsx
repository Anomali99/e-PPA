import React, { useState, useEffect } from "react";
import { PaymentSantri, PaymentSpp } from "../components";
import { getPayment } from "../api";

type PaymentSantriType = {
  santri_uuid: string;
  name: string;
  gender: string;
  total: number;
  spp: {
    spp_uuid: string;
    year: string;
    month: string;
    total: number;
    spp_santri_uuid: string;
  }[];
};

type PaymentSppType = {
  year: string;
  month: string;
  nominal_spp: number;
  nominal_kosma: number;
  spp_uuid: string;
};

const PaymentPage: React.FC = () => {
  const [page, setPage] = useState<number>(-1);
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [putra, setPutra] = useState<PaymentSantriType[]>([]);
  const [putri, setPutri] = useState<PaymentSantriType[]>([]);
  const [payment, setPayment] = useState<PaymentSppType[]>([]);

  useEffect(() => {
    const getData = async () => {
      const results = await getPayment();
      const putra_result =
        results.data?.santri.filter((item) => {
          return item.gender === "l";
        }) || [];
      const putri_result =
        results.data?.santri.filter((item) => {
          return item.gender === "p";
        }) || [];
      setPayment(results.data?.spp || []);
      setPutra(putra_result);
      setPutri(putri_result);
    };

    getData();
    const access_level = localStorage.getItem("access_level") || "4";
    setAccessLevel(access_level);
    if (page === -1) {
      setPage(0);
    }
    if (access_level === "3") {
      setPage(1);
    }
  }, []);

  const setPageHandle = (value: number) => {
    if (
      (value === 0 && accessLevel === "3") ||
      (value === 1 && accessLevel === "2")
    ) {
      console.log("Disabled");
    } else {
      setPage(value);
    }
  };

  return (
    <div className="w-full p-6">
      <ul className="flex flex-wrap text-sm font-medium text-center text-gray-500 border-b border-gray-200">
        <li className="self-center px-4">
          <a href="/dashboard">
            <svg
              className="size-8 hover:scale-110 hover:text-blue-600"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 -960 960 960"
              fill="currentColor"
            >
              <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
            </svg>
          </a>
        </li>
        <li className="me-2">
          <button
            className={`inline-block p-4 rounded-t-lg ${
              accessLevel === "3"
                ? " text-gray-400 cursor-not-allowed"
                : page === 0
                ? " text-blue-600 bg-gray-100 active"
                : " hover:text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setPageHandle(0)}
          >
            Putra
          </button>
        </li>
        <li className="me-2">
          <button
            className={`inline-block p-4 rounded-t-lg ${
              accessLevel === "2"
                ? " text-gray-400 cursor-not-allowed"
                : page === 1
                ? " text-blue-600 bg-gray-100 active"
                : " hover:text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setPageHandle(1)}
          >
            Putri
          </button>
        </li>
        <li className="me-2">
          <button
            className={`inline-block p-4 rounded-t-lg ${
              page === 2
                ? " text-blue-600 bg-gray-100 active"
                : " hover:text-gray-600 hover:bg-gray-50"
            }`}
            onClick={() => setPageHandle(2)}
          >
            Payments
          </button>
        </li>
      </ul>
      <div className="w-full flex flex-col mt-4">
        {page === 0 ? (
          <PaymentSantri data={putra} spp={payment} />
        ) : page === 1 ? (
          <PaymentSantri data={putri} spp={payment} />
        ) : page === 2 ? (
          <PaymentSpp data={payment} />
        ) : (
          ""
        )}
      </div>
    </div>
  );
};

export default PaymentPage;
