import React, { useEffect } from "react";
import { Textarea } from "@windmill/react-ui";

import { isJSON } from "../../../utils/json";

const CustomOutboundEditor = ({ forwardRule, protocol, settings, setSettings, setValid }) => {
  useEffect(() => {
    if (protocol === "custom") {
      setValid(() => () => isJSON(settings));
    }
  }, [protocol, settings, setValid]);
  useEffect(() => {
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.custom_outbound
    ) {
      setSettings(
        JSON.stringify(forwardRule.config.outbound, undefined, 2)
      );
    } else {
      setSettings("")
    }
  }, [forwardRule, setSettings])
  return (
    <>
      <Textarea
        className="mt-4"
        rows="6"
        value={settings}
        onChange={(e) => setSettings(e.target.value)}
      />
    </>
  );
};

export default CustomOutboundEditor;
