import React, { FormEvent, useEffect, useState } from "react";
import { addSchool, updateSchool, addSantri, updateSantri } from "../api";

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
  isOpen: boolean;
  isSantri: boolean;
  isAdd: boolean;
  data: DataType;
  allSchool: SchoolType[];
  setIsOpen: () => void;
};

const DataModal: React.FC<ParamsType> = ({
  isOpen,
  setIsOpen,
  data,
  isAdd,
  isSantri,
  allSchool,
}) => {
  if (!isOpen) return null;

  const [uuid, setUuid] = useState<string>("");
  const [name, setName] = useState<string>("");
  const [nis, setNis] = useState<string>("");
  const [address, setAddress] = useState<string>("");
  const [parent, setParent] = useState<string>("");
  const [gender, setGender] = useState<string>("");
  const [yatim, setYatim] = useState<boolean>(false);
  const [school, setSchool] = useState<string>("");

  useEffect(() => {
    if (!isAdd && data) {
      setUuid(data.uuid);
      setName(data.name);
      setNis(data.nis || "");
      setAddress(data.address || "");
      setParent(data.parent || "");
      setGender(data.gender || "");
      setSchool(data.school_uuid || "");
      setYatim(data.yatim || false);
    } else {
      setUuid("");
      setName("");
      setNis("");
      setAddress("");
      setParent("");
      setGender("");
      setSchool("");
      setYatim(false);
    }
  }, [data, isAdd]);

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isSantri) {
      if (isAdd) {
        await addSantri({
          address,
          gender,
          name,
          nis,
          parent,
          yatim,
          school_uuid: school,
        });
      } else {
        console.log({
          address,
          gender,
          name,
          nis,
          parent,
          yatim,
          school_uuid: school,
          santri_uuid: uuid,
        });
        console.log(
          await updateSantri({
            address,
            gender,
            name,
            nis,
            parent,
            yatim,
            school_uuid: school,
            santri_uuid: uuid,
          })
        );
      }
    } else {
      if (isAdd) {
        await addSchool({ name });
      } else {
        await updateSchool({ name, school_uuid: uuid });
      }
    }
    window.location.reload();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={setIsOpen}
      ></div>
      <div className="relative p-4 w-full max-w-md max-h-full bg-white rounded-lg shadow-lg z-10">
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">
            {isAdd ? "Tambah" : "Perbaruhi"} {isSantri ? "Santri" : "Sekolah"}
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

        <form className="p-4" onSubmit={submitHandler}>
          <div className="grid gap-4 mb-4 grid-cols-2">
            <div className="col-span-2">
              <label
                htmlFor="name"
                className="block mb-2 text-sm font-medium text-gray-900"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                required
              />
            </div>
            {isSantri && (
              <>
                <div className="col-span-2">
                  <label
                    htmlFor="school"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    School
                  </label>
                  <select
                    id="school"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={school}
                    onChange={(e) => setSchool(e.target.value)}
                    required
                  >
                    <option value="" disabled>
                      Select School --
                    </option>
                    {allSchool.map((item) => (
                      <option key={item.school_uuid} value={item.school_uuid}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="nis"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    NIS
                  </label>
                  <input
                    type="text"
                    name="nis"
                    id="nis"
                    value={nis}
                    onChange={(e) => setNis(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="address"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Address
                  </label>
                  <input
                    type="text"
                    name="address"
                    id="address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="parent"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Parent
                  </label>
                  <input
                    type="text"
                    name="parent"
                    id="parent"
                    value={parent}
                    onChange={(e) => setParent(e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    required
                  />
                </div>
                <div className="col-span-2">
                  <label
                    htmlFor="gender"
                    className="block mb-2 text-sm font-medium text-gray-900"
                  >
                    Gender
                  </label>
                  <select
                    id="gender"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full p-2.5"
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                  >
                    <option value="" disabled>
                      Select Gender --
                    </option>
                    <option value="l">L</option>
                    <option value="p">P</option>
                  </select>
                </div>
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="yatim"
                      type="checkbox"
                      typeof="boolean"
                      checked={yatim}
                      onChange={(e) => setYatim(e.target.checked)}
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300"
                    />
                  </div>
                  <label
                    htmlFor="yatim"
                    className="ms-2 text-sm font-medium text-gray-900"
                  >
                    apakah <strong>Yatim</strong>
                  </label>
                </div>
              </>
            )}
          </div>
          <button
            type="submit"
            className="text-white inline-flex items-center bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            {isAdd ? "Tambah" : "Perbaruhi"}
          </button>
          <button
            type="button"
            onClick={setIsOpen}
            className="ml-6 text-white inline-flex items-center bg-red-700 hover:bg-red-800 focus:ring-4 focus:outline-none focus:ring-red-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          >
            Batal
          </button>
        </form>
      </div>
    </div>
  );
};

export default DataModal;
