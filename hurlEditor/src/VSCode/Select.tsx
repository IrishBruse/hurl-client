import { CSSProperties, FunctionComponent, useState } from "react";

type Option = {
    value: string;
    label: string;
    style: CSSProperties;
};

type SelectProps = {
    value: string;
    onChange: (value: string) => void;
    style?: CSSProperties;
    options: Option[];
};

export const Select: FunctionComponent<SelectProps> = ({ value: initialValue, onChange, style, options }) => {
    const [value, setValue] = useState(initialValue);
    const [open, setOpen] = useState(false);
    return (
        <div className="select">
            <button className="select-input" onClick={() => setOpen((val) => !val)} style={style}>
                <div style={options.find((o) => o.value === value)?.style}>{value}</div>
            </button>
            {open && (
                <div className="select-dropdown">
                    {options.map(({ label, value, style }) => {
                        return (
                            <option
                                key={value}
                                onClick={() => {
                                    onChange(value);
                                    setOpen(false);
                                    setValue(value);
                                }}
                                style={style}>
                                {label}
                            </option>
                        );
                    })}
                </div>
            )}
        </div>
    );
};
