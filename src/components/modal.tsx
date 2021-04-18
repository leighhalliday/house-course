import React from "react";
import { createPortal } from "react-dom";

interface IModal {
  open: boolean;
  children: React.ReactNode;
  onClose(): any;
}

export default function Modal({ open, children, onClose }: IModal) {
  if (open) {
    return createPortal(
      <div className="absolute w-full h-full bg-gray-900">
        <div className="fixed top-2/4 left-1/4 bg-white -translate-y-2/4 -translate-x-2/4 pin z-50 overflow-auto rounded-lg text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div className="bg-white px-4 pt-16 pb-16 sm:p-6 sm:pb-4">
            <div className="flex items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h1
                  className="text-lg text-center leading-6 font-medium text-gray-900"
                  id="modal-title"
                >
                  {children}
                </h1>
              </div>
            </div>
          </div>
          {/* <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-green-600 text-base font-medium text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onClose}
            >
              Confirm
            </button>
          </div> */}
        </div>
      </div>,
      document.getElementById("modal-root") as HTMLElement
    );
  } else {
    return "" as any;
  }
}
