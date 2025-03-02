import type { Request } from "hurl-js-parser/types";
import { Select } from "../VSCode/Select";
import { TextField } from "../VSCode/Textfield";
import { Button } from "../VSCode/Button";
import { vscode } from "../main";
import { useEffect, useState } from "react";

const methods = [
    { value: "GET", label: "GET", style: { color: "skyblue" } },
    { value: "POST", label: "POST", style: { color: "lightgreen" } },
    { value: "PUT", label: "PUT", style: { color: "orange" } },
    { value: "DELETE", label: "DELETE", style: { color: "red" } },
    { value: "PATCH", label: "PATCH", style: { color: "yellow" } },
    { value: "HEAD", label: "HEAD", style: { color: "magenta" } },
    { value: "OPTIONS", label: "OPTIONS", style: { color: "cyan" } },
];

export type RequestBarProps = {
    request: Request;
    onChange: (key: keyof Request, value: unknown) => void;
};

export function RequestBar({ request, onChange }: RequestBarProps) {
    const [url, setUrl] = useState(request.url);

    useEffect(() => {
        onChange("url", url);
    }, [url]);

    return (
        <span
            style={{
                display: "flex",
                gap: "6px",
                padding: "1rem",
            }}>
            <Select value={request.method} onChange={(value) => onChange("method", value)} options={methods} style={{ width: "100px" }}></Select>
            <TextField
                value={url}
                onChange={(value) => setUrl(value)}
                name="url"
                placeholder="https://example.com/api/v1"
                style={{ width: "100%", minWidth: "200px" }}
            />
            <Button
                onClick={() => {
                    console.log("Run");
                    vscode.postMessage({ type: "Foo", data: "bar" });
                }}>
                Send
            </Button>
        </span>
    );
}
