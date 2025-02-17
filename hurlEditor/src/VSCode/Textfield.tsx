import { ChangeEventHandler, FunctionComponent, PropsWithChildren } from "react";

type TextFieldProps = {
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
};

export const TextField: FunctionComponent<PropsWithChildren<TextFieldProps>> = ({ value, onChange, children }) => {
    return (
        <input className="textfield" value={value} onChange={onChange}>
            {children}
        </input>
    );
};
