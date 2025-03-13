import type { Request } from "hurl-js-parser/types";
import { RequestBar } from "./RequestBar";
import { KeyValueTable } from "../VSCode/KeyValueTable";
import { Tabs } from "../VSCode/Tabs";
import { Dispatch, useEffect, useState } from "react";
import Editor from "react-simple-code-editor";
import { Action } from "../App";
import { OptionsTab } from "./OptionsTab";

export type RequestPanelProps = {
    request: Request;
    dispatch: Dispatch<Action>;
};

export function RequestPanel({ request, dispatch }: RequestPanelProps) {
    const [code, setCode] = useState("");

    useEffect(() => {
        setCode(JSON.stringify(request.body?.value, null, 4));
    }, [request.body]);

    return (
        <div style={{ display: "flex", flexDirection: "column", height: "100%", overflow: "hidden" }}>
            <RequestBar request={request} dispatch={dispatch} />
            <Tabs tabs={["Params", "Body", "Header", "Auth", "Options"]}>
                <div>
                    <KeyValueTable value={[{ key: "asd", value: "dsa" }]} onChange={() => {}}></KeyValueTable>
                </div>
                <div>
                    <Editor
                        value={code}
                        highlight={(v) => v}
                        onValueChange={(value) => {
                            setCode(value);
                        }}></Editor>
                </div>
                <div>
                    {request.headers && (
                        <KeyValueTable value={request.headers?.flatMap((h) => ({ key: h.name, value: h.value }))} onChange={() => {}}></KeyValueTable>
                    )}
                </div>
                <div>D</div>
                <div>
                    {/* <KeyValueTable
                        value={request.options?.filter((v) => v.name !== "variable").flatMap((opt) => ({ key: opt.name, value: opt.value + (opt.unit ?? "") }))}
                        onChange={() => {}}></KeyValueTable> */}
                    <OptionsTab request={request} dispatch={dispatch}></OptionsTab>
                </div>
            </Tabs>
        </div>
    );
}
