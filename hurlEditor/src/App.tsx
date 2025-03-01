import { useEffect, useState } from "react";
import { SplitPane } from "./VSCode/SplitPane";
import { Hurl, Request, Response } from "hurl-js-parser/types";
import { vscode } from "./main";
import bigExample from "./examples/bigExample.json";
import { RequestPanel } from "./Components/RequestPanel";
import { ResponsePanel } from "./Components/ResponsePanel";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
if ((window as any).acquireVsCodeApi) {
    const logging = ["log", "warn", "error"] as const;
    for (const type of logging) {
        const method = console[type].bind(console);
        console[type] = (...args) => {
            vscode.postMessage({ type: type, args: JSON.stringify(args) });
            method(...args);
        };
    }
} else {
    setTimeout(() => {
        window.postMessage({
            source: "hurl-editor",
            type: "update",
            text: JSON.stringify(bigExample),
        });
    }, 100);
}

export function App() {
    const [hurl, setHurl] = useState<Hurl>();

    useEffect(() => {
        vscode.postMessage({ type: "react-ready" });

        const messageHandler = (event: MessageEvent) => {
            const data = event.data;

            if (data.source !== "hurl-editor") {
                return;
            }

            if (data.type === "update") {
                const file = JSON.parse(data.text) as Hurl;
                setHurl(file);

                console.log("Event (file): ", file);
            }
        };

        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    }, []);

    const onChangeRequest = (key: keyof Request, value: unknown) => {
        console.log(key, value);
    };

    const onChangeResponse = (key: keyof Response, value: unknown) => {
        console.log(key, value);
    };

    if (!hurl) {
        return null;
    }

    const entry = hurl.entries[0];

    return (
        <SplitPane initialWidth={window.innerWidth / 2} minLeft={250} minRight={200}>
            <RequestPanel request={entry.request} onChange={onChangeRequest} key={entry.request.url} />
            <ResponsePanel response={entry.response} onChange={onChangeResponse} />
        </SplitPane>
    );
}
