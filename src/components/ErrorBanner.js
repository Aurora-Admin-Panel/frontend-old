import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Transition } from "@windmill/react-ui";
import { X } from "phosphor-react";

import { clearError } from "../redux/actions/error"

const ErrorBanner = () => {
  const error = useSelector((state) => state.error);
  const dispatch = useDispatch();
  return (
      <>
    <Transition
      show={error.show}
      enter="transition ease-in-out duration-150"
      enterFrom="opacity-0 transform"
      enterTo="opacity-100"
      leave="transition ease-in-out duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 transform"
    >
      <div
        className="absolute top-1/10 right-0 bg-red-100 border-l-4 border-red-400 text-red-700 p-4 z-9999 hidden lg:block"
        role="alert"
      >
        <p className="font-bold">{error.title}</p>
        <p>{error.body}</p>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => dispatch(clearError())}>
          <X />
        </span>
      </div>
      </Transition>
    <Transition
      show={error.show}
      enter="transition ease-in-out duration-150"
      enterFrom="opacity-0 transform -translate-y-20"
      enterTo="opacity-100"
      leave="transition ease-in-out duration-150"
      leaveFrom="opacity-100"
      leaveTo="opacity-0 transform -translate-y-20"
    >
      <div
        className="absolute top-1/10 left-0 right-0 ml-3 mr-3 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-9999 lg:hidden"
        role="alert"
      >
        <strong className="font-bold">{error.title}</strong>
        <span className="block sm:inline">{error.body}</span>
        <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => dispatch(clearError())}>
          <X />
        </span>
      </div>
    </Transition>
      </>
  );
};

export default ErrorBanner;
