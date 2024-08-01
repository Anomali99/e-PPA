import React, { FormEvent, useState } from "react";
import { uploadImage } from "../api";
import Modal from "./Modal";

type PropsType = {
  uuid: string;
  isOpen: boolean;
  setIsOpen: () => void;
};

const OnlinePayment: React.FC<PropsType> = ({ uuid, isOpen, setIsOpen }) => {
  if (!isOpen) return null;
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [open, setOpen] = useState<boolean>(false);
  const [statusCode, setStatusCode] = useState<number>(0);
  const [message, setMessage] = useState<string>("");

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
      setFile(selectedFile);

      const fileReader = new FileReader();
      fileReader.onload = () => {
        setPreviewUrl(fileReader.result as string);
      };
      fileReader.readAsDataURL(selectedFile);
    }
  };

  const submitHandler = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const res = await uploadImage(file, uuid);
    setStatusCode(res.status);
    setMessage(res.message);
    setOpen(true);
  };

  const closeHandle = () => {
    if (statusCode === 200) {
      setFile(null);
      setOpen(false);
      setIsOpen();
    } else {
      setOpen(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div
        className="fixed inset-0 bg-black opacity-50"
        onClick={setIsOpen}
      ></div>
      <div className="relative p-4 w-max max-w-screen-xl max-h-full bg-white rounded-lg shadow-lg z-10">
        <div className="flex items-center justify-between p-4 border-b rounded-t">
          <h3 className="text-lg font-semibold text-gray-900">
            Bayar Secara Online
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
        <div className="w-full flex flex-row gap-0">
          {previewUrl !== null ? (
            <img
              src={previewUrl}
              alt="Preview"
              className="w-full max-h-96 object-cover mb-4 bg-slate-500 m-2"
            />
          ) : (
            ""
          )}
          <div className="w-full max-w-screen-lg p-4">
            <p className="max-h-96 w-full max-w-screen-sm bg-slate-400 rounded-lg p-4 mb-4">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. A
              possimus, unde in inventore consequuntur fugit aspernatur
              molestias ipsam distinctio tenetur consectetur! Eligendi,
              aspernatur consequatur, excepturi perspiciatis quia adipisci
              dolores incidunt tempora tenetur in a vel dicta laboriosam facere
              voluptates esse?
            </p>
            <form className="space-y-4 md:space-y-6" onSubmit={submitHandler}>
              <div>
                <label
                  htmlFor="upload"
                  className="block mb-2 text-sm font-medium text-gray-900"
                >
                  Bukti Transfer
                </label>
                <input
                  type="file"
                  name="upload"
                  id="upload"
                  onChange={handleFileChange}
                  className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5"
                />
              </div>
              <button
                type="submit"
                disabled={!file}
                className="w-full text-white bg-primary-600 hover:bg-primary-700 focus:ring-4 focus:outline-none focus:ring-primary-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-primary-200 disabled:cursor-not-allowed"
              >
                Upload
              </button>
            </form>
          </div>
        </div>
      </div>
      <Modal
        isOpen={open}
        message={message}
        onClose={closeHandle}
        danger={statusCode !== 200}
      />
    </div>
  );
};

export default OnlinePayment;
