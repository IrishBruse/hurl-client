import { RequestBar } from "./Components/RequestBar";
import { useEffect, useState } from "react";
import { SplitPane } from "./VSCode/SplitPane";

const vscode = window.acquireVsCodeApi();

function App() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [req, setReq] = useState<any>({
        request: {
            method: "GET",
            url: "",
        },
    });

    // Register the message listener and notify extension when ready
    useEffect(() => {
        // Send a ready signal immediately once the app is mounted.
        vscode.postMessage({ command: "appReady" });

        const messageHandler = (event: MessageEvent) => {
            console.log("React received message:", event.data);
            if (event.data.type === "update") {
                // Assume event.data.text contains the new request data
                setReq({
                    method: "GET",
                    url: "",
                });
            }
        };

        window.addEventListener("message", messageHandler);
        return () => window.removeEventListener("message", messageHandler);
    }, []);

    return (
        <SplitPane initialWidth={window.innerWidth / 2} minLeft={200} minRight={200}>
            <div>
                <RequestBar request={req} />
                <vscode-tabs panel>
                    <vscode-tab-header slot="header">Params</vscode-tab-header>
                    <vscode-tab-panel style={{ margin: "0 1rem" }}>A</vscode-tab-panel>
                    <vscode-tab-header slot="header">Body</vscode-tab-header>
                    <vscode-tab-panel style={{ margin: "0 1rem" }}>B</vscode-tab-panel>
                    <vscode-tab-header slot="header">Header</vscode-tab-header>
                    <vscode-tab-panel style={{ margin: "0 1rem" }}>C</vscode-tab-panel>
                    <vscode-tab-header slot="header">Auth</vscode-tab-header>
                    <vscode-tab-panel style={{ margin: "0 1rem" }}>D</vscode-tab-panel>
                </vscode-tabs>
            </div>
            <div style={{ margin: "1.5rem 1rem" }}>test</div>
        </SplitPane>
    );
}
export default App;
