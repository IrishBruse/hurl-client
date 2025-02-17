import { CSSProperties, FunctionComponent, useRef, useState } from "react";

type Option = {
    value: string;
    label: string;
    style: CSSProperties;
};

type SelectProps = {
    defaultValue: string;
    onChange: (value: string) => void;
    style?: CSSProperties;
    options: Option[];
};

export const Select: FunctionComponent<SelectProps> = ({ defaultValue, onChange, style, options }) => {
    const [value, setValue] = useState(defaultValue);
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const handleBlur = (e: React.FocusEvent<HTMLDivElement>) => {
        // Check if the new focused element is inside our component
        if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setOpen(false);
        }
    };

    return (
        <div className="select" ref={containerRef} tabIndex={0} onBlur={handleBlur}>
            <button className="select-input" onClick={() => setOpen((val) => !val)} style={style}>
                <div style={options.find((o) => o.value === value)?.style}>{value}</div>
            </button>
            <div className={"select-dropdown" + (open ? "  open" : "")} onBlur={() => console.log("Blur Dropdown")}>
                {options.map(({ label, value, style }) => {
                    return (
                        <option
                            key={value}
                            onClick={() => {
                                onChange(value);
                                setValue(value);
                                setOpen(false);
                            }}
                            style={style}>
                            {label}
                        </option>
                    );
                })}
            </div>
        </div>
    );
};
