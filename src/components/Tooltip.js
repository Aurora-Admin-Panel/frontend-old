import React, { useState } from "react";

const Tooptip = ({ children, tip }) => {
  const [showTip, setShowTip] = useState(false);
  return (
    <div className="relative z-20 inline-flex">
      <div
        onMouseEnter={() => setShowTip(true)}
        onMouseLeave={() => setShowTip(false)}
      >
        {children}
      </div>
      {showTip ? (
        <div className="relative">
          <div
            className="absolute top-0 z-30 w-auto whitespace-pre p-2 mt-1 text-sm leading-tight text-black transform -translate-x-1/2 -translate-y-full bg-white rounded-lg shadow-lg"
            onMouseEnter={() => setShowTip(true)}
            onMouseLeave={() => setShowTip(false)}
          >
            {tip}
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default Tooptip;
