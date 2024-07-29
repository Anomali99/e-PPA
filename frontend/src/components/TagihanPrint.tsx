import React, { useEffect, useState } from "react";

type SppType = {
  spp_uuid: string;
  year: string;
  month: string;
  nominal_spp: number;
  nominal_kosma: number;
  total: number;
};

type PropsType = {
  data: {
    spp: SppType[];
    tagihan: number;
  };
};

const TagihanPrint = React.forwardRef<HTMLDivElement, PropsType>(
  (props, ref) => {
    const [spp, setSpp] = useState<SppType[]>([]);
    const [tagihan, setTagihan] = useState<number>(0);

    useEffect(() => {
      if (props.data) {
        setSpp(props.data.spp);
        setTagihan(props.data.tagihan);
      }
    }, [props.data]);

    return (
      <div className="hidden">
        <div ref={ref} className="w-full h-full px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Detail Tagihan Santri
          </h3>
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 mt-6">
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
                  Subtotal
                </th>
              </tr>
            </thead>
            <tbody className="flex flex-col w-full">
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
                  className="px-6 py-4 w-full font-medium text-gray-900 whitespace-nowrap capitalize"
                >
                  Total
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
      </div>
    );
  }
);

export default TagihanPrint;
