import { RequestBar } from "./Components/RequestBar";
import { useEffect, useState } from "react";
import { SplitPane } from "./VSCode/SplitPane";
import { Entry, HurlFile, Method } from "hurl-js-parser/types";
import { Tabs } from "./VSCode/Tabs";
import { KeyValueTable } from "./VSCode/KeyValueTable";

const vscode = window.acquireVsCodeApi();

function App() {
    const [entry, setHurl] = useState<Entry>({
        request: {
            method: "GET" as Method,
            url: "",
        },
    });

    useEffect(() => {
        vscode.postMessage({ command: "appReady" });

        const messageHandler = (event: MessageEvent) => {
            const data = event.data;

            if (data.source !== "hurl-editor") {
                return;
            }

            if (data.type === "update") {
                const file = JSON.parse(data.text) as HurlFile;
                console.log("Event (content): ", file);
                setHurl(file.entries[0]);
            }
        };

        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    }, []);

    return (
        <SplitPane initialWidth={window.innerWidth / 2} minLeft={250} minRight={200}>
            <div>
                <RequestBar request={entry.request} />
                <Tabs tabs={["Params", "Body", "Header", "Auth"]}>
                    <div>
                        <KeyValueTable initialData={{}} onChange={() => {}}></KeyValueTable>
                    </div>
                    <div>B</div>
                    <div>C</div>
                    <div>D</div>
                </Tabs>
            </div>
            <div style={{ margin: "1.5rem 1rem" }}>test</div>
        </SplitPane>
    );
}
export default App;
