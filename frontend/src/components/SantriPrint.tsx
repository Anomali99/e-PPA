import React, { useState, useEffect } from "react";

type SantriType = {
  santri_uuid: string;
  name: string;
  nis: string;
  address: string;
  parent: string;
  gender: string;
  yatim: boolean;
  school_name: string;
  school_uuid: string;
};

type PropsType = {
  data: SantriType[];
  santri: string;
};

const SantriPrint = React.forwardRef<HTMLDivElement, PropsType>(
  (props, ref) => {
    const [santri, setSantri] = useState<SantriType[]>([]);

    useEffect(() => {
      setSantri(props.data);
    }, [props]);

    return (
      <div className="hidden">
        <style>
          {`@page {
            size: landscape;
        }`}
        </style>
        <div ref={ref} className="w-full h-full px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Data Santri {props.santri}
          </h3>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-6">
            <thead className="text-xs text-gray-700 uppercase bg-gray-200 flex flex-col w-full">
              <tr className="w-full flex flex-row">
                <th scope="col" className="px-6 py-3 w-full">
                  Name
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  NIS
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Address
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Parent
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  Yatim
                </th>
                <th scope="col" className="px-6 py-3 w-full">
                  School Name
                </th>
              </tr>
            </thead>
            <tbody className="flex flex-col w-full">
              {santri.map((item) => (
                <tr
                  key={item.santri_uuid}
                  className="border-b cursor-pointer flex flex-row odd:bg-white even:bg-gray-50"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 w-full font-medium text-gray-900 whitespace-nowrap capitalize"
                  >
                    {item.name}
                  </th>
                  <td className="px-6 py-4 w-full">{item.nis}</td>
                  <td className="px-6 py-4 w-full">{item.address}</td>
                  <td className="px-6 py-4 w-full">{item.parent}</td>
                  <td className="px-6 py-4 w-full uppercase">{item.gender}</td>
                  <td className="px-6 py-4 w-full capitalize">
                    {item.yatim ? "ya" : "tidak"}
                  </td>
                  <td className="px-6 py-4 w-full">{item.school_name}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

export default SantriPrint;
