import React, { useEffect, useCallback, useState } from "react";

import { Input, Label } from "@windmill/react-ui";


const SocksInboundEditor = ({
  forwardRule,
  protocol,
  settings,
  setSettings,
  setValid,
}) => {
  const [user, setUser] = useState("");
  const [pass, setPass] = useState("");
  const validUser = useCallback(() => settings.auth === "password" ? user.length > 0 : true, [user, settings]);
  const validPass = useCallback(() => settings.auth === "password" ? pass.length > 0 : true, [pass, settings]);
  const validIp = useCallback(() => settings.udp ? settings.ip.length > 0 : true, [settings]);;
  const validInbound = useCallback(() => validUser() && validPass() && validIp(), [validUser, validPass, validIp]);

  const handleUser = (u) => {
    setUser(u);
    let account;
    if (settings.accounts && settings.accounts.length > 0) {
      account = settings.accounts[0]
      account.user = u;
    } else {
      account = { user: u, pass: "" }
    }
    setSettings({ ...settings, accounts: [account], auth: "password" })
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
    setSettings({ ...settings, accounts: [account], auth: "password" })
  }

  useEffect(() => {
    if (protocol === "socks") {
      setValid(() => validInbound);
    }
  }, [protocol, setValid, validInbound]);
  useEffect(() => {
    const defaultSettings = {
      auth: "noauth",
      accounts: [],
      udp: false,
      ip: "",
    };
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.inbound &&
      forwardRule.config.inbound.protocol === "socks" &&
      forwardRule.config.inbound.settings
    )
      setSettings({ ...defaultSettings, ...forwardRule.config.inbound.settings });
    else
      setSettings(defaultSettings);
  }, [forwardRule, protocol, setSettings]);

  return (
    <div className="">
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>加密</span>
          </div>
          <div className="w-2/3">
            <Input
              type="checkbox"
              checked={settings.auth === "password"}
              onChange={() =>
                setSettings({
                  ...settings,
                  auth: settings.auth === "noauth" ? "password" : "noauth",
                })
              }
            />
          </div>
        </div>
      </Label>
      {settings.auth === "password" ? (
        <>
          <Label className="mt-1">
            <div className="flex flex-row justify-between items-center mt-1">
              <div className="w-1/3">
                <span>用户名</span>
              </div>
              <div className="w-2/3">
                <Input
                  className="mt-1"
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
                  value={settings.port}
                  valid={validPass()}
                  onChange={(e) => handlePass(e.target.value)}
                />
              </div>
            </div>
          </Label>
        </>
      ) : null}


      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <div className="w-1/3">
            <span>UDP</span>
          </div>
          <div className="w-2/3">
            <Input
              type="checkbox"
              checked={settings.udp}
              onChange={() =>
                setSettings({
                  ...settings,
                  udp: !settings.udp,
                })
              }
            />
          </div>
        </div>
      </Label>
      {settings.udp ?
        <Label className="mt-1">
          <div className="flex flex-row justify-between items-center mt-1">
            <div className="w-1/3">
              <span>本机IP</span>
            </div>
            <div className="w-2/3">
              <Input
                className="mt-1"
                placeholder="UDP需填写本机IP"
                value={settings.ip}
                valid={validIp()}
                onChange={(e) => setSettings({ ...settings, ip: e.target.value })}
              />
            </div>
          </div>
        </Label>
        : null}
    </div>
  );
};

export default SocksInboundEditor;
