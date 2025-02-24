import { RequestBar } from "./Components/RequestBar";
import { useEffect, useState } from "react";
import { SplitPane } from "./VSCode/SplitPane";
import { Method } from "hurl-js-parser/types";
import { Tabs } from "./VSCode/Tabs";
import { KeyValueTable } from "./VSCode/KeyValueTable";

const vscode = window.acquireVsCodeApi();

function App() {
    const [hurl, setHurl] = useState({
        request: {
            method: "GET" as Method,
            url: "",
        },
    });

    // Register the message listener and notify extension when ready
    useEffect(() => {
        // Send a ready signal immediately once the app is mounted.
        vscode.postMessage({ command: "appReady" });

        const messageHandler = (event: MessageEvent) => {
            if ((event.source as unknown) !== "hurl-editor") {
                return;
            }

            console.log("React received message:", event.data);
            if (event.data.type === "update") {
                // Assume event.data.text contains the new request data
                setHurl({
                    request: {
                        method: "GET",
                        url: "",
                    },
                });
            }
        };

        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    }, []);

    return (
        <SplitPane initialWidth={window.innerWidth / 2} minLeft={250} minRight={200}>
            <div>
                <RequestBar request={hurl.request} />
                <Tabs tabs={["Params", "Body", "Header", "Auth"]}>
                    <div>
                        <KeyValueTable initialData={{ key: "value", bazz: "123" }} onChange={() => {}}></KeyValueTable>
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
