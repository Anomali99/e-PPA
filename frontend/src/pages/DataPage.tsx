import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import { useNavigate } from "react-router-dom";
import { getAllScholl, getSantriByGender } from "../api";
import { DataModal, DataTable, Pagination, SantriPrint } from "../components";

type SchoolType = {
  name: string;
  school_uuid: string;
};

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

const DataPage: React.FC<{ content: number }> = ({ content }) => {
  const [school, setSchool] = useState<SchoolType[]>([]);
  const [santri, setSantri] = useState<SantriType[]>([]);
  const [current, setCurrent] = useState<DataType>({ uuid: "", name: "" });
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [accessLevel, setAccessLevel] = useState<string>("");
  const [maxPage, setMaxPage] = useState<number>(1);
  const [page, setPage] = useState<number>(1);
  const navigate = useNavigate();
  const max = 12;

  useEffect(() => {
    const getData = async () => {
      const access_level = localStorage.getItem("access_level") || "4";
      setAccessLevel(access_level);
      if (content === 3) {
        const schoolResponse = await getAllScholl();
        setSchool(schoolResponse.data || []);
        let size = schoolResponse.data?.length || 0;
        let hasilPembagian = size / max;
        setMaxPage(Math.ceil(hasilPembagian || 0 / max));
      } else if (content === 2) {
        if (access_level === "2") {
          navigate("/dashboard");
        } else {
          const putriResponse = await getSantriByGender("p");
          setSchool(putriResponse.data?.school || []);
          setSantri(putriResponse.data?.santri || []);
          let size = putriResponse.data?.santri.length || 0;
          let hasilPembagian = size / max;
          setMaxPage(Math.ceil(hasilPembagian || 0 / max));
        }
      } else if (content === 1) {
        if (access_level === "3") {
          navigate("/dashboard");
        } else {
          const putraResponse = await getSantriByGender("l");
          setSchool(putraResponse.data?.school || []);
          setSantri(putraResponse.data?.santri || []);
          let size = putraResponse.data?.santri.length || 0;
          let hasilPembagian = size / max;
          setMaxPage(Math.ceil(hasilPembagian || 0 / max));
        }
      }
    };

    getData();
  }, [content]);

  const componentRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: "Cetak data",
    onAfterPrint: () => console.log("Printed PDF successfully!"),
  });

  const printOrCancel = () => {
    if (current.name === "") {
      handlePrint();
    } else {
      setCurrent({ uuid: "", name: "" });
    }
  };

  const modalHandle = () => setIsOpen(!isOpen);

  return (
    <div className="w-full h-full p-4 flex justify-center flex-col gap-3 md:gap-6">
      {content !== 3 ? (
        <SantriPrint
          ref={componentRef}
          data={santri}
          santri={content === 1 ? "Putra" : "Putri"}
        />
      ) : (
        ""
      )}
      <h1 className="text-sm md:text-xl font-bold flex flex-row gap-2 md:gap-4 items-center">
        <a href="/dashboard">
          <svg
            className="size-5 md:size-10 hover:scale-110 hover:text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 -960 960 960"
            fill="currentColor"
          >
            <path d="m313-440 224 224-57 56-320-320 320-320 57 56-224 224h487v80H313Z" />
          </svg>
        </a>
        <span>
          Data{" "}
          {content !== 3
            ? `Santri ${content === 1 ? "Putra" : "Putri"}`
            : "Sekolah"}
        </span>
      </h1>

      <DataTable
        current={current}
        isSchool={content === 3}
        santri={santri}
        school={school}
        setCurrent={setCurrent}
        page={page}
        max={max}
      />

      <div className="w-full flex flex-col md:flex-row md:justify-between md:items-center gap-2">
        <Pagination page={page} max={maxPage} setCurrent={setPage} />
        <div className="w-full flex justify-end">
          {["1", "2", "3"].includes(accessLevel) ? (
            <button
              className="relative h-max inline-flex items-center justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-purple-600 to-blue-500 group-hover:from-purple-600 group-hover:to-blue-500 hover:text-white focus:outline-none"
              onClick={modalHandle}
            >
              <span className="relative flex items-center px-2 md:px-5 py-1.5 md:py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <svg
                  className="size-4 md:size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                >
                  {current.uuid === "" ? (
                    <path d="M440-280h80v-160h160v-80H520v-160h-80v160H280v80h160v160Zm40 200q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  ) : (
                    <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
                  )}
                </svg>
                {current.uuid == "" ? "Tambah" : "Edit"}
              </span>
            </button>
          ) : (
            ""
          )}
          {content !== 3 || current.uuid !== "" ? (
            <button
              className="relative inline-flex items-center h-max justify-center p-0.5 mb-2 me-2 overflow-hidden text-xs md:text-sm font-medium text-gray-900 rounded-lg group bg-gradient-to-br from-green-600 to-yellow-500 group-hover:from-green-600 group-hover:to-yellow-500 hover:text-white focus:outline-none"
              onClick={printOrCancel}
            >
              <span className="relative flex items-center px-2 md:px-5 py-1.5 md:py-2.5 transition-all ease-in duration-75 bg-white rounded-md group-hover:bg-opacity-0">
                <svg
                  className="size-4 md:size-6"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 -960 960 960"
                  fill="currentColor"
                >
                  {current.uuid === "" ? (
                    <path d="M640-640v-120H320v120h-80v-200h480v200h-80Zm-480 80h640-640Zm560 100q17 0 28.5-11.5T760-500q0-17-11.5-28.5T720-540q-17 0-28.5 11.5T680-500q0 17 11.5 28.5T720-460Zm-80 260v-160H320v160h320Zm80 80H240v-160H80v-240q0-51 35-85.5t85-34.5h560q51 0 85.5 34.5T880-520v240H720v160Zm80-240v-160q0-17-11.5-28.5T760-560H200q-17 0-28.5 11.5T160-520v160h80v-80h480v80h80Z" />
                  ) : (
                    <path d="m336-280 144-144 144 144 56-56-144-144 144-144-56-56-144 144-144-144-56 56 144 144-144 144 56 56ZM480-80q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
                  )}
                </svg>
                {current.uuid === "" ? "Cetak" : "Batal"}
              </span>
            </button>
          ) : (
            ""
          )}
        </div>
      </div>

      <DataModal
        isOpen={isOpen}
        setIsOpen={modalHandle}
        isAdd={current.uuid === ""}
        data={current}
        isSantri={content !== 3}
        allSchool={school}
      />
    </div>
  );
};

export default DataPage;
