import type { Request } from "hurl-js-parser/types";
import { Dispatch } from "react";
import { Action } from "../App";
import { Options } from "./Options/OptionsDefinition";
import { Setting, SettingType } from "../VSCode/Setting";

const OptionsHeaders: Record<string, string> = {
    authentication: "Authentication",
    networking: "Networking",
    request_handling: "Request Handling",
    execution_performance: "Execution Performance",
    output_debugging: "Output Debugging",
    file_management: "File Management",
};

export type OptionsTabProps = {
    request: Request;
    dispatch: Dispatch<Action>;
};

export function OptionsTab({ request, dispatch }: OptionsTabProps) {
    return (
        <div>
            {Object.entries(Options).map(([key, value]) => {
                return (
                    <div>
                        <h1 style={{ fontSize: "26px", fontWeight: 600 }}>{OptionsHeaders[key]}</h1>
                        <div>
                            {Object.entries(value).map(([key, value]) => {
                                return (
                                    <Setting
                                        value=""
                                        onChange={() => {}}
                                        type={value.type as SettingType}
                                        name={value.name ?? "Error: " + key}
                                        description={value.description}></Setting>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
