import React, { useEffect, useCallback } from "react";

import { Input, Label, Textarea } from "@windmill/react-ui";

const TlsEditor = ({ tlsProvider, forwardRule, settings, setSettings, setValid }) => {
  const validCertificate = useCallback(() => 
    settings.certificate && 
    RegExp("^-+BEGIN[ A-Z]+-+.*-+END[ A-Z]+-+$", 's').test(settings.certificate), [settings])
  const validKey = useCallback(() => 
    settings.key && 
    RegExp("^-+BEGIN[ A-Z]+-+.*-+END[ A-Z]+-+$", 's').test(settings.key), [settings])

  const validTls = useCallback(() => validCertificate() && validKey(), [validCertificate, validKey]);

  useEffect(() => {
    if (tlsProvider === "certificate") {
      setValid(() => validTls)
    }
  }, [tlsProvider, setValid, validTls])
  useEffect(() => {
    if (
      forwardRule &&
      forwardRule.config &&
      forwardRule.config.tls_provider === "certificate"
    ) {
      setSettings(forwardRule.config.tls_settings);
    } else {
      setSettings({
        alpn: "http/1.1",
        certificate: "",
        key: ""
      })
    } 
  }, [forwardRule, setSettings])
  return (
    <div className="">
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <span>alpn</span>
          <Input
            placeholder="http/1.1"
            value={settings.alpn}
            onChange={(e) => setSettings({ ...settings, alpn: e.target.value })}
          />
        </div>
      </Label>
      <Label className="mt-4">
        <div className="flex flex-row justify-between items-center mt-1">
          <span>证书</span>
          <Textarea
            rows={3}
            placeholder="-----BEGIN CERTIFICATE-----"
            value={settings.certificate}
            valid={validCertificate()}
            onChange={(e) => setSettings({ ...settings, certificate: e.target.value })}
          />
        </div>
      </Label>
      <Label className="mt-1">
        <div className="flex flex-row justify-between items-center mt-1">
          <span>密钥</span>
          <Textarea
            rows={3}
            placeholder="-----BEGIN PRIVATE KEY-----"
            value={settings.key}
            valid={validKey()}
            onChange={(e) => setSettings({ ...settings, key: e.target.value })}
          />
        </div>
      </Label>
    </div>)
};

export default TlsEditor;
