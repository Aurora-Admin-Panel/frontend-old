import React, { useEffect, useCallback } from "react";

const FreedomEditor = ({ protocol, setValid }) => {
  const validOutbound = useCallback(() => true, []);

  useEffect(() => {
    if (protocol === "freedom") {
        setValid(() => validOutbound)
    }
  }, [protocol, setValid, validOutbound])
  return <></>;
};

export default FreedomEditor;
