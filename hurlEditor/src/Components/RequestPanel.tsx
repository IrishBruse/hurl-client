import type { Request } from "hurl-js-parser/types";
import { RequestBar } from "./RequestBar";
import { KeyValueTable } from "../VSCode/KeyValueTable";
import { Tabs } from "../VSCode/Tabs";
import { useState } from "react";

export type RequestPanelProps = {
    request: Request;
    onChange: (key: keyof Request, value: unknown) => void;
};

export function RequestPanel({ request, onChange }: RequestPanelProps) {
    const [settings, setSettings] = useState();
    return (
        <div>
            <RequestBar
                request={request}
                onChange={(key, value) => {
                    // setHurl((pre) => ({ ...pre, request: { ...pre.request, [key]: value } }));
                }}
            />
            <Tabs tabs={["Params", "Body", "Header", "Auth", "Options"]}>
                <KeyValueTable value={{ foo: "bar" }} onChange={() => {}}></KeyValueTable>
                {/* <div>{JSON.stringify(entry.request.body?.value, null, 4)}</div> */}
                <div>C</div>
                <div>D</div>
                <KeyValueTable value={request.options} onChange={() => {}}></KeyValueTable>
            </Tabs>
        </div>
    );
}
