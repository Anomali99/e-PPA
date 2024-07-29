import React, { useEffect, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import TagihanPrint from "./TagihanPrint";

type SppType = {
  spp_uuid: string;
  year: string;
  month: string;
  nominal_spp: number;
  nominal_kosma: number;
  total: number;
};

type TagihanType = {
  total: number;
  spp: SppType[];
};

type PropsType = {
  isOpen: boolean;
  data: TagihanType | null;
  setIsOpen: () => void;
};

const ViewDeatils: React.FC<PropsType> = ({ isOpen, data, setIsOpen }) => {
  if (!isOpen) return null;

  const [tagihan, setTagihan] = useState<number>(0);
  const [spp, setSpp] = useState<SppType[]>([]);
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (data) {
      setTagihan(data.total);
      setSpp(data.spp);
    }
  }, [data]);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Tagihan Santri",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <TagihanPrint ref={componentRef} data={{ spp, tagihan }} />
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={setIsOpen}
      ></div>
      <div className="relative p-4 w-full max-w-screen-xl max-h-full bg-white rounded-lg shadow-lg z-10">
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">
            Detail Tagihan Santri
          </h3>
          <button
            type="button"
            onClick={setIsOpen}
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

        <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 flex flex-col w-full">
              <tr className="w-full flex flex-row">
                <th scope="col" className="px-6 py-3 w-full">
                  Bulan
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Tahun
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Nominal SPP
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Nominal Kosma
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  subtotal
                </th>
              </tr>
            </thead>
            <tbody className="flex flex-col overflow-y-auto h-[50vh] w-full">
              {spp.map((item) => (
                <tr
                  key={item.spp_uuid}
                  className="border-b cursor-pointer flex flex-row odd:bg-white even:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 w-full font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {item.month}
                  </th>
                  <td className="px-6 py-4 w-full">{item.year}</td>
                  <td className="px-6 py-4 w-full">
                    {item.nominal_spp.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="px-6 py-4 w-full">
                    {item.nominal_kosma.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                  <td className="px-6 py-4 w-full">
                    {item.total.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </td>
                </tr>
              ))}
              <tr className="border-b cursor-pointer flex flex-row bg-gray-200 justify-between">
                <th
                  scope="row"
                  className="px-6 py-4  w-full  font-medium text-gray-900 whitespace-nowrap capitalize"
                >
                  total
                </th>
                <td className="px-6 py-4 w-1/4 font-bold">
                  {tagihan.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="w-full flex flex-row gap-4 justify-end mt-6">
          <button
            type="button"
            onClick={setIsOpen}
            className="w-full max-w-40 text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handlePrint}
            className="w-full max-w-40 text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Print
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewDeatils;
