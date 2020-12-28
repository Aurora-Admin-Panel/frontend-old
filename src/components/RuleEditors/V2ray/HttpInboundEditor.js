import React, { useEffect, useCallback, useState } from "react";

import { Input, Label } from "@windmill/react-ui";


const HttpInboundEditor = ({
  forwardRule,
  protocol,
  settings,
  setSettings,
  setValid,
}) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const validUser = useCallback(() => !pass ? !user : user.length > 0, [user, pass]);
  const validPass = useCallback(() => !user ? !pass : pass.length > 0, [user, pass]);
  const validInbound = useCallback(() => validUser() && validPass(), [validUser, validPass]);

  const handleUser = (u) => {
    setUser(u);
    let account;
    if (settings.accounts && settings.accounts.length > 0) {
      account = settings.accounts[0]
      account.user = u;
    } else {
      account = { user: u, pass: "" }
    }
    setSettings({ ...settings, accounts: [account] })
  }
  const handlePass = (p) => {
    setPass(p)
    let account;
    if (settings.accounts && settings.accounts.length > 0) {
      account = settings.accounts[0]
      account.pass = p;
    } else {
      account = { user: "", pass: p }
    }
    setSettings({ ...settings, accounts: [account] })
  }

  useEffect(() => {
    if (protocol === "http") {
      setValid(() => validInbound);
    }
  }, [protocol, setValid, validInbound]);
  useEffect(() => {
    const defaultSettings = {
      timeout: 0,
      accounts: [],
      allowTransparent: false,
    };
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol === "http" &&
      forwardRule.config.inbound.settings
    ) {
      setSettings({ ...defaultSettings, ...forwardRule.config.inbound.settings });
      if (
        forwardRule.config.inbound.settings.accounts &&
        forwardRule.config.inbound.settings.accounts.length > 0 &&
        forwardRule.config.inbound.settings.accounts[0].user) {
        setUser(forwardRule.config.inbound.settings.accounts[0].user)
      }
      if (
        forwardRule.config.inbound.settings.accounts &&
        forwardRule.config.inbound.settings.accounts.length > 0 &&
        forwardRule.config.inbound.settings.accounts[0].pass) {
        setPass(forwardRule.config.inbound.settings.accounts[0].pass)
      }
    }
    else
      setSettings(defaultSettings);
  }, [forwardRule, protocol, setSettings]);

  return (
    <div className="">
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>超时</span>
          </div>
          <div className="w-2/3">
            <Input
              className="mt-1"
              placeholder="默认为0"
              value={settings.timeout}
              onChange={(e) => setSettings({ ...settings, timeout: e.target.value })}
            />
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>用户名</span>
          </div>
          <div className="w-2/3">
            <Input
              className="mt-1"
              placeholder="可为空"
              value={user}
              valid={validUser()}
              onChange={(e) => handleUser(e.target.value)}
            />
          </div>
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>密码</span>
          </div>
          <div className="w-2/3">
            <Input
              className="mt-1"
              placeholder="可为空"
              value={pass}
              valid={validPass()}
              onChange={(e) => handlePass(e.target.value)}
            />
          </div>
        </div>
      </Label>

      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>allowTransparent</span>
          </div>
          <div className="w-2/3">
            <Input
              type="checkbox"
              checked={settings.allowTransparent}
              onChange={() =>
                setSettings({
                  ...settings,
                  allowTransparent: !settings.allowTransparent,
                })
              }
            />
          </div>
        </div>
      </Label>
    </div>
  );
};

export default HttpInboundEditor;
