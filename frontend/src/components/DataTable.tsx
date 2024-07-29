import React, { useEffect, useState } from "react";

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

type SchoolType = {
  name: string;
  school_uuid: string;
};

type DataType = {
  uuid: string;
  name: string;
  nis?: string;
  address?: string;
  parent?: string;
  gender?: string;
  yatim?: boolean;
  school_name?: string;
  school_uuid?: string;
};

type ParamsType = {
  santri: SantriType[];
  school: SchoolType[];
  current: DataType;
  setCurrent: (data: DataType) => void;
  isSchool: boolean;
  page: number;
  max: number;
};

const DataTable: React.FC<ParamsType> = ({
  santri,
  school,
  isSchool,
  current,
  page,
  max,
  setCurrent,
}) => {
  const [thisSchool, setSchool] = useState<SchoolType[]>([]);
  const [thisSantri, setSantri] = useState<SantriType[]>([]);
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [thisCurrent, setThisCurrent] = useState<DataType>({
    uuid: "",
    name: "",
  });

  useEffect(() => {
    setSantri(santri);
    setSchool(school);
    setThisCurrent(current);
    const access_level = localStorage.getItem("access_level") || "4";
    setAccessLevel(access_level);
  }, [santri, school, current, page]);

  const getSantriSize = (): SantriType[] => {
    const end = page * max;
    const start = end - max;

    return thisSantri.slice(start, end);
  };

  const getSchoolSize = (): SchoolType[] => {
    const end = page * max;
    const start = end - max;

    return thisSchool.slice(start, end);
  };

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left rtl:text-right text-gray-500">
        <thead className="text-xs text-gray-700 uppercase bg-gray-200">
          <tr>
            {isSchool ? (
              <>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  School UUID
                </th>
              </>
            ) : (
              <>
                <th scope="col" className="px-6 py-3">
                  Name
                </th>
                <th scope="col" className="px-6 py-3">
                  Santri UUID
                </th>
                <th scope="col" className="px-6 py-3">
                  NIS
                </th>
                <th scope="col" className="px-6 py-3">
                  Address
                </th>
                <th scope="col" className="px-6 py-3">
                  Parent
                </th>
                <th scope="col" className="px-6 py-3">
                  Gender
                </th>
                <th scope="col" className="px-6 py-3">
                  Yatim
                </th>
                <th scope="col" className="px-6 py-3">
                  School Name
                </th>
              </>
            )}
          </tr>
        </thead>
        <tbody>
          {isSchool
            ? getSchoolSize().map((item) => (
                <tr
                  key={item.school_uuid}
                  className={` border-b ${
                    ["1", "2", "3"].includes(accessLevel)
                      ? "cursor-pointer"
                      : ""
                  } ${
                    thisCurrent.uuid === item.school_uuid
                      ? "bg-gray-100"
                      : "odd:bg-white even:bg-gray-50"
                  }`}
                  onClick={() => {
                    ["1", "2", "3"].includes(accessLevel)
                      ? setCurrent({ uuid: item.school_uuid, name: item.name })
                      : "";
                  }}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.name}
                  </th>
                  <td className="px-6 py-4">{item.school_uuid}</td>
                </tr>
              ))
            : getSantriSize().map((item) => (
                <tr
                  key={item.santri_uuid}
                  className={`border-b ${
                    ["1", "2", "3"].includes(accessLevel)
                      ? "cursor-pointer"
                      : ""
                  } ${
                    thisCurrent.uuid === item.santri_uuid
                      ? "bg-gray-100"
                      : "odd:bg-white even:bg-gray-50 "
                  }`}
                  onClick={() => {
                    ["1", "2", "3"].includes(accessLevel)
                      ? setCurrent({
                          uuid: item.santri_uuid,
                          name: item.name,
                          address: item.address,
                          gender: item.gender,
                          nis: item.nis,
                          parent: item.parent,
                          yatim: item.yatim,
                          school_name: item.school_name,
                          school_uuid: item.school_uuid,
                        })
                      : "";
                  }}
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap"
                  >
                    {item.name}
                  </th>
                  <td className="px-6 py-4">{item.santri_uuid}</td>
                  <td className="px-6 py-4">{item.nis}</td>
                  <td className="px-6 py-4">{item.address}</td>
                  <td className="px-6 py-4">{item.parent}</td>
                  <td className="px-6 py-4 uppercase">{item.gender}</td>
                  <td className="px-6 py-4">
                    {item.yatim ? "yatim" : "tidak yatim"}
                  </td>
                  <td className="px-6 py-4">{item.school_name}</td>
                </tr>
              ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTable;
