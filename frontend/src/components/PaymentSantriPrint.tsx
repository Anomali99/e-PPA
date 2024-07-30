import React, { useEffect, useState } from "react";

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

type DataType = {
  santri: PaymentSantriType[];
  date: {
    year: string;
    months: string[];
  };
};

type PropsType = {
  data: PaymentSantriType[];
  santri: string;
};

const PaymentSantriPrint = React.forwardRef<HTMLDivElement, PropsType>(
  (props, ref) => {
    const [santri, setSantri] = useState<PaymentSantriType[]>([]);

    useEffect(() => {
      setSantri(props.data);
    }, [props]);

    const getYearUniqe = (): Record<string, number> => {
      if (santri.length > 0) {
        console.log(santri.length);
        const spp = santri[0].spp;
        return spp.reduce((acc, item) => {
          if (!acc[item.year]) {
            acc[item.year] = 1;
          } else {
            acc[item.year]++;
          }
          return acc;
        }, {} as Record<string, number>);
      } else {
        return {};
      }
    };

    const getData = (): DataType[] => {
      const result_data: DataType[] = [];
      if (santri.length > 0) {
        const years = Object.keys(getYearUniqe());

        for (const year of years) {
          const santri_result = santri
            .map((item) => {
              const filteredSpp = item.spp.filter(
                (sppItem) => sppItem.year === year
              );
              return { ...item, spp: filteredSpp };
            })
            .filter((item) => item.spp.length > 0);

          if (santri_result.length > 0) {
            const months = santri_result[0].spp.map((sppItem) => sppItem.month);
            result_data.push({
              santri: santri_result,
              date: { year, months },
            });
          }
        }
      }

      return result_data;
    };

    const check_true = (uuid: string, spp_uuid: string): boolean => {
      if (uuid === "") return false;
      if (uuid === null) return false;
      if (uuid === spp_uuid) return false;
      return true;
    };

    return (
      <div className="hidden">
        <style>
          {`@page {
          size: landscape;
      }`}
        </style>
        <div ref={ref} className="w-full h-full px-8 py-6">
          <h3 className="text-lg font-semibold text-gray-900">
            Pembayaran Santri {props.santri}
          </h3>
          {getData().map((item, index) => (
            <div className="mt-6" key={index}>
              <h3 className="text-[10px] font-semibold text-gray-900 w-screen text-center">
                Tahun {item.date.year}
              </h3>
              <table className="text-center text-[8px] rtl:text-right text-gray-500 mt-4">
                <thead className="text-gray-700 uppercase bg-gray-200">
                  <tr>
                    <th scope="col" className="px-6 py-3">
                      Name
                    </th>
                    {item.date.months.map((month, monthIndex) => (
                      <th
                        key={`${index}-${month}-${monthIndex}`}
                        className="px-6 py-3"
                      >
                        {month}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {item.santri.map((santriItem, santriIndex) => (
                    <tr
                      key={`${index}-${santriItem.santri_uuid}-${santriIndex}`}
                      className="border-b cursor-pointer odd:bg-white even:bg-gray-50"
                    >
                      <th
                        scope="row"
                        className="px-4 py-3 text-left font-medium text-gray-900 whitespace-nowrap capitalize"
                      >
                        {santriItem.name}
                      </th>
                      {santriItem.spp.map((sppItem, sppIndex) => (
                        <td
                          key={`${index}-${santriItem.santri_uuid}-${sppIndex}`}
                          className="px-4 py-3 w-full"
                        >
                          {check_true(sppItem.spp_santri_uuid, sppItem.spp_uuid)
                            ? sppItem.total.toLocaleString("id-ID", {
                                style: "currency",
                                currency: "IDR",
                              })
                            : "-"}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

export default PaymentSantriPrint;
