import React from 'react';
import {
    ArrowUp,
    ArrowDown,
    SmileyXEyes,
  } from "phosphor-react";


const UsageCell = ({ usage, flexStyle='col' }) => {
  return (
    <div className={`flex flex-${flexStyle} justify-center`}>
      {usage && usage.readable_download && usage.readable_upload ? (
        <>
          <span className="flex flex-auto items-center">
            <ArrowUp size={16} />
            {usage.readable_upload}
          </span>
          <span className="flex flex-auto items-center">
            <ArrowDown size={16} />
            {usage.readable_download}
          </span>
        </>
      ) : (
        <SmileyXEyes weight="bold" size={20} />
      )}
    </div>
  );
};

export default UsageCell;
