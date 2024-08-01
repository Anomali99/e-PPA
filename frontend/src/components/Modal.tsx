import React from "react";

type ParamsType = {
  isOpen: boolean;
  message: string;
  onClose: () => void;
  onYes?: () => void | null;
  danger?: boolean;
};

const Modal: React.FC<ParamsType> = ({
  isOpen,
  message,
  onClose,
  onYes = null,
  danger = true,
}) => {
  if (!isOpen) return null;

  return (
    <div
      id="popup-modal"
      tabIndex={-1}
      className="fixed inset-0 z-50 flex items-center justify-center w-full h-screen bg-black bg-opacity-50"
      aria-modal="true"
      role="dialog"
    >
      <div className="relative w-full max-w-md p-4 max-h-full bg-white rounded-lg shadow">
        <button
          type="button"
          className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center"
          onClick={onClose}
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
          <span className="sr-only">Close modal</span>
        </button>
        <div className="p-4 md:p-5 text-center">
          <svg
            className={`mx-auto mb-4 w-12 h-12 ${
              danger ? " text-red-600" : " text-green-600"
            }`}
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill={danger ? "none" : "currentColor"}
            viewBox={danger ? "0 0 20 20" : "0 -960 960 960"}
          >
            {danger ? (
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M10 11V6m0 8h.01M19 10a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
              />
            ) : (
              <path d="m424-296 282-282-56-56-226 226-114-114-56 56 170 170Zm56 216q-83 0-156-31.5T197-197q-54-54-85.5-127T80-480q0-83 31.5-156T197-763q54-54 127-85.5T480-880q83 0 156 31.5T763-763q54 54 85.5 127T880-480q0 83-31.5 156T763-197q-54 54-127 85.5T480-80Zm0-80q134 0 227-93t93-227q0-134-93-227t-227-93q-134 0-227 93t-93 227q0 134 93 227t227 93Zm0-320Z" />
            )}
          </svg>
          <h3 className="mb-5 text-lg font-normal text-gray-500 capitalize">
            {message}
          </h3>
          {onYes !== null ? (
            <button
              type="button"
              className={`text-white focus:ring-4 focus:outline-none font-medium rounded-lg text-sm inline-flex items-center px-5 py-2.5 text-center ${
                danger
                  ? " bg-red-600 hover:bg-red-800 focus:ring-red-300"
                  : " bg-green-600 hover:bg-green-800 focus:ring-green-300"
              }`}
              onClick={onYes}
            >
              "Oke"
            </button>
          ) : (
            ""
          )}

          <button
            type="button"
            className="py-2.5 px-5 ms-3 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-lg border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100"
            onClick={onClose}
          >
            {onYes === null ? "Oke" : "Cancel"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
