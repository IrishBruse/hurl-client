import type { Response } from "hurl-js-parser/types";

export type ResponsePanelProps = {
    response?: Response;
    onChange: (key: keyof Response, value: unknown) => void;
};

export function ResponsePanel({ response, onChange }: ResponsePanelProps) {
    return <div>test</div>;
}
