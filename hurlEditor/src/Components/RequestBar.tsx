/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Method, Request } from "hurl-js-parser/types";
import { useState } from "react";
import { Select } from "../VSCode/Select";
import { TextField } from "../VSCode/Textfield";

const methods = [
    { value: "GET", label: "GET", style: { color: "skyblue" } },
    { value: "POST", label: "POST", style: { color: "lightgreen" } },
    { value: "PUT", label: "PUT", style: { color: "orange" } },
    { value: "DELETE", label: "DELETE", style: { color: "red" } },
    { value: "PATCH", label: "PATCH", style: { color: "yellow" } },
    { value: "HEAD", label: "HEAD", style: { color: "magenta" } },
    { value: "OPTIONS", label: "OPTIONS", style: { color: "cyan" } },
];

export function RequestBar({ request }: { request: Request }) {
    const [method, setMethod] = useState(request.method);
    const [url, setUrl] = useState(request.url);
    const changeMethod = (value: string) => {
        setMethod(value as Method);
    };
    const changeUrl = (e: React.ChangeEvent<HTMLInputElement>) => {
        setUrl(e.target?.value);
    };

    console.log(method);

    return (
        <span
            style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "1rem",
            }}>
            <Select defaultValue={method} onChange={changeMethod} options={methods} style={{ width: "100px" }}></Select>
            <TextField value={url} onChange={changeUrl as any} style={{ width: "100%" }} />
            <vscode-button
                onClick={() => {
                    //
                }}>
                Send
            </vscode-button>
        </span>
    );
}
