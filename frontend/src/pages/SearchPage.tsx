import React, { FormEvent, useState } from "react";
import { getSantriByNis } from "../api";
import { Modal, OnlinePayment, ViewDeatils } from "../components";

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

type TagihanType = {
  total: number;
  spp: {
    spp_uuid: string;
    year: string;
    month: string;
    nominal_spp: number;
    nominal_kosma: number;
    total: number;
  }[];
};

const SearchPage: React.FC = () => {
  const [nis, setNis] = useState<string>("");
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [viewDetails, setViewDetails] = useState<boolean>(false);
  const [onlinePayment, setOnlinePayment] = useState<boolean>(false);
  const [message, setMessage] = useState<string>("");
  const [santri, setSantri] = useState<SantriType | null>(null);
  const [tagihan, setTagihan] = useState<TagihanType | null>(null);

  const submitHandle = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = await getSantriByNis(nis);
    console.log(result);
    if (result.message === "get data success") {
      setSantri(result.data?.santri || null);
      setTagihan(result.data?.tagihan || null);
    } else {
      setMessage(result.message);
      setIsOpen(true);
    }
  };

  const onClose = () => setIsOpen(false);

  const viewDetailsHandle = () => setViewDetails(!viewDetails);
  const onlinePaymentHandle = () => setOnlinePayment(!onlinePayment);

  return (
    <section className="bg-gray-50">
      <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
        <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0">
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl">
              Lihat Tanggungan Santri
            </h1>
            <form className="space-y-4 md:space-y-6" onSubmit={submitHandle}>
              <div>
                <label
                  htmlFor="nis"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  NIS Santri
                </label>
                <input
                  type="text"
                  name="nis"
                  id="nis"
                  value={nis}
                  onChange={(e) => setNis(e.target.value)}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>

              {santri === null ? (
                <button
                  type="submit"
                  className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                >
                  Cari
                </button>
              ) : (
                <>
                  <div>
                    <label
                      htmlFor="name"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Nama
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={santri?.name || ""}
                      disabled
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="schoolName"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Sekolah
                    </label>
                    <input
                      type="text"
                      name="schoolName"
                      id="schoolName"
                      value={santri?.school_name || ""}
                      disabled
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="parent"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Wali
                    </label>
                    <input
                      type="text"
                      name="parent"
                      id="parent"
                      value={santri?.parent || ""}
                      disabled
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="gender"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Jenis Kelamin
                    </label>
                    <input
                      type="text"
                      name="gender"
                      id="gender"
                      value={
                        santri?.gender === "l"
                          ? "Laki-Laki"
                          : santri?.gender === "p"
                          ? "Perempuan"
                          : "" || ""
                      }
                      disabled
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="block mb-2 text-sm font-medium text-gray-900"
                    >
                      Alamat
                    </label>
                    <textarea
                      name="address"
                      id="address"
                      rows={3}
                      value={santri?.address || ""}
                      disabled
                      className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                    />
                  </div>
                  <div className="w-full flex flex-col gap-4">
                    <div className="w-full flex flex-row gap-4">
                      <button
                        type="button"
                        onClick={viewDetailsHandle}
                        className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Lihat Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setSantri(null);
                          setNis("");
                        }}
                        className="w-full text-white bg-gray-600 hover:bg-gray-700 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                      >
                        Batal
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={onlinePaymentHandle}
                      className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                      Bayar Secara Online
                    </button>
                  </div>
                </>
              )}
            </form>
            <Modal isOpen={isOpen} message={message} onClose={onClose} />
            <ViewDeatils
              isOpen={viewDetails}
              data={tagihan}
              setIsOpen={viewDetailsHandle}
            />
            <OnlinePayment
              uuid={santri?.santri_uuid || ""}
              isOpen={onlinePayment}
              setIsOpen={onlinePaymentHandle}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default SearchPage;
