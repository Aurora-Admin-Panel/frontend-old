import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { Transition } from "@windmill/react-ui";
import { X } from "phosphor-react";

import { clearBanner } from "../redux/actions/banner";

const Banner = () => {
  const banner = useSelector((state) => state.banner);
  let bannerTypeClass = "bg-red-100 border-red-400 text-red-700";
  if (banner.type) {
    if (banner.type === "success") {
      bannerTypeClass = "bg-green-100 border-green-400 text-green-700";
    } else if (banner.type === "warning") {
      bannerTypeClass = "bg-yellow-100 border-yellow-400 text-yellow-700";
    }
  }
  const dispatch = useDispatch();
  return (
    <>
      <Transition
        show={banner.show}
        enter="transition ease-in-out duration-150"
        enterFrom="opacity-0 transform"
        enterTo="opacity-100"
        leave="transition ease-in-out duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 transform"
      >
        <div
          className={`absolute top-1/10 whitespace-pre-wrap w-48 right-0 border-l-4 p-4 z-9999 hidden lg:block ${bannerTypeClass}`}
          role="alert"
        >
          <p className="font-bold">{banner.title}</p>
          <p>{banner.body}</p>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => dispatch(clearBanner())}
          >
            <X />
          </span>
        </div>
      </Transition>
      <Transition
        show={banner.show}
        enter="transition ease-in-out duration-150"
        enterFrom="opacity-0 transform -translate-y-20"
        enterTo="opacity-100"
        leave="transition ease-in-out duration-150"
        leaveFrom="opacity-100"
        leaveTo="opacity-0 transform -translate-y-20"
      >
        <div
          className={`absolute top-1/10 left-0 right-0 ml-3 mr-3 border px-4 py-3 rounded z-9999 lg:hidden ${bannerTypeClass}`}
          role="alert"
        >
          <strong className="font-bold">{banner.title}</strong>
          <span className="block sm:inline">{banner.body}</span>
          <span
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => dispatch(clearBanner())}
          >
            <X />
          </span>
        </div>
      </Transition>
    </>
  );
};

export default Banner;
