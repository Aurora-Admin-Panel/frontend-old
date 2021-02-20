import React from "react";

const ColoredButton = ({ color = "purple", scale=600, onClick, children }) => {
    return <button
        className={`align-bottom inline-flex items-center justify-center cursor-pointer leading-5 transition-colors duration-150 font-medium focus:outline-none px-3 py-1 rounded-md text-sm text-white border border-transparent bg-${color}-${scale} active:bg-${color}-${scale+100} hover:bg-${color}-${scale+100}`}
        onClick={onClick}
    >
        {children}
    </button>
}

export default ColoredButton;