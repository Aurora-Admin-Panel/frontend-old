import React, { useEffect, useCallback } from "react";

const BlackholeEditor = ({ protocol, setValid }) => {
  const validOutbound = useCallback(() => true, []);

  useEffect(() => {
    if (protocol === "blackhole") {
        setValid(() => validOutbound)
    }
  }, [protocol, setValid, validOutbound])
  return <></>;
};

export default BlackholeEditor;
