import React, { useEffect } from "react";

type PropsType = {
  month: number;
  year: string;
  nominal: boolean;
  setMonth: (value: number) => void;
  setYear: (value: string) => void;
  setNominal: (value: boolean) => void;
  getYearUniqe: () => Record<string, number>;
};

const MonthPagination: React.FC<PropsType> = (props) => {
  useEffect(() => {}, [props]);

  return (
    <div className="w-full flex flex-row gap-4 justify-between md:justify-end items-center mb-4">
      <div className="flex items-center">
        <label className="flex flex-col md:flex-row  gap-x-4 gap-y-1.5 items-center">
          <span className="text-xs md:text-normal font-bold">
            {props.nominal ? "Nominal" : "Date"}
          </span>
          <div className="inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={props.nominal}
              onChange={(e) => props.setNominal(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
          </div>
        </label>
      </div>
      <div className="flex flex-col md:flex-row gap-x-4 gap-y-1.5 items-center">
        <h1 className="text-xs md:text-normal font-bold">Triwulan: </h1>
        <div className="flex flex-row gap-4">
          <button
            className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
              props.month === 1
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => props.setMonth(1)}
          >
            1
          </button>
          <button
            className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
              props.month === 2
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => props.setMonth(2)}
          >
            2
          </button>
          <button
            className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
              props.month === 3
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => props.setMonth(3)}
          >
            3
          </button>
          <button
            className={`text-xs md:text-normal px-3 py-2 md:px-4 md:py-2 text-white font-bold rounded-lg ${
              props.month === 4
                ? "bg-gray-500 cursor-not-allowed"
                : "bg-gray-300 hover:bg-gray-400"
            }`}
            onClick={() => props.setMonth(4)}
          >
            4
          </button>
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-x-4 gap-y-1.5 items-center">
        <h1 className="text-xs md:text-normal font-bold text-right">Tahun: </h1>
        <select
          value={props.year}
          onChange={(e) => props.setYear(e.target.value)}
          className="text-xs md:text-normal bg-gray-50 border border-gray-300 text-gray-900 md:text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-max p-1 md:p-2.5"
        >
          {Object.keys(props.getYearUniqe()).map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};

export default MonthPagination;
