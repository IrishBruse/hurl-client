import { useEffect, useReducer, useState } from "react";
import { SplitPane } from "./VSCode/SplitPane";
import { Entry, Hurl, Method, Response } from "hurl-js-parser/types";
import { vscode } from "./main";
import bigExample from "./examples/request.hurl.json";
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
    const [entryIndex, setEntryIndex] = useState(0);
    const [state, dispatch] = useReducer(reducer, defaultHurl);

    useEffect(() => {
        vscode.postMessage({ type: "react-ready" });

        const messageHandler = (event: MessageEvent) => {
            const data = event.data;

            if (data.source !== "hurl-editor") {
                return;
            }

            if (data.type === "update") {
                const file = JSON.parse(data.text) as Hurl;
                dispatch({ type: "SET_ENTRIES", payload: file.entries });
                setEntryIndex(0);

                console.log("Event (file): ", file);
            }
        };

        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    }, []);

    const onChangeResponse = (key: keyof Response, value: unknown) => {
        console.log(key, value);
    };

    if (!state) {
        return null;
    }

    const entry = state.entries[entryIndex];

    return (
        <SplitPane initialWidth={window.innerWidth / 2} minLeft={250} minRight={200}>
            <RequestPanel request={entry.request} dispatch={dispatch} />
            <ResponsePanel response={entry.response} onChange={onChangeResponse} />
        </SplitPane>
    );
}

const defaultHurl: Hurl = {
    entries: [
        {
            request: {
                method: "GET",
                url: "",
            },
        },
    ],
};

export type Action =
    | { type: "UPDATE_METHOD"; payload: Method }
    | { type: "UPDATE_URL"; payload: string }
    | { type: "SET_ENTRIES"; payload: Entry[] }
    | { type: "UPDATE"; payload: unknown };

function reducer(prev: Hurl, action: Action): Hurl {
    const entry = 0;

    console.group("Reducer update");
    console.log("State:", prev);
    console.log("Entry:", entry);
    const { type, payload } = action;
    console.log("Action:", type);
    console.log(payload);
    console.groupEnd();

    const hurl = { ...prev, entries: [...prev.entries] };

    switch (type) {
        case "SET_ENTRIES":
            return { entries: payload };

        case "UPDATE_URL":
            hurl.entries[entry].request.url = payload;
            return hurl;
        case "UPDATE_METHOD":
            hurl.entries[entry].request.method = payload;
            return hurl;

        default:
            console.error("Unhandled Action:", type);
            break;
    }

    return defaultHurl;
}
