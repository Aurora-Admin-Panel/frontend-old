import React from "react";
import ReactLoading from "react-loading";

const FullScreenLoading = ({
  height = 50,
  width = 50,
  type = "bubbles",
  color = "#000",
}) => (
  <div className="w-ful flex items-center justify-center">
    <ReactLoading height={height} width={width} type={type} color={color} />
  </div>
);

export default FullScreenLoading;
