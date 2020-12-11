import React from 'react'
import { v4 as uuidv4 } from 'uuid';

import {
    ArrowClockwise,
} from "phosphor-react";
import { Input, Label, Select, Button, HelperText } from "@windmill/react-ui";

const VmessEditor = ({ settings, setSettings }) => {
    const handIdChange = (e, idx) => {
        e.preventDefault();
        if (e.type === "change") settings.clients[idx].uuid = e.target.value;
        else if (e.type === "click") settings.clients[idx].uuid = uuidv4();
        setSettings({ ...settings });
    }
    const handleAlterIdChange = (e, idx) => {
        e.preventDefault();
        settings.clients[idx].alterId = e.target.value;
        setSettings({ ...settings });
    }
    const handleEmailChange = (e, idx) => {
        e.preventDefault();
        settings.clients[idx].email = e.target.value;
        setSettings({ ...settings });
    }
    return (
        <div className="">
            {settings.clients ? (
                settings.clients.map((client, idx) => (
                    <div className="flex flex-col mt-4" key={`vmess_client_${idx}`}>
                        {/* <h3 className="text-lg">用户</h3> */}
                        <div className="flex flex-col justify-start" key={`inbound_protocol_clients_${client.id}`}>
                            <div className="relative mb-1">
                                <Input className="pr-6" value={client.uuid} onChange={e => handIdChange(e, idx)} />
                                <button className="hidden" />
                                <button className="absolute inset-y-0 right-0 mr-2" onClick={e => handIdChange(e, idx)}><ArrowClockwise weight="bold" /></button>
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                <div className="w-1/3">
                                    <HelperText className="ml-1">alterId</HelperText>
                                </div>
                                <div className="w-2/3">
                                    <HelperText className="ml-1">email</HelperText>
                                </div>
                            </div>
                            <div className="flex flex-row items-center space-x-2">
                                <div className="w-1/3">
                                    <Input
                                        value={client.alterId}
                                        onChange={e => handleAlterIdChange(e, idx)}
                                    />
                                </div>
                                <div className="w-2/3">
                                    <Input
                                        value={client.email}
                                        placeholder="可为空"
                                        onChange={e => handleEmailChange(e, idx)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                ))) : null}

        </div>)
}

export default VmessEditor;