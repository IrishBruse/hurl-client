import { CSSProperties, FunctionComponent, useRef, useState } from "react";
import styles from "./Select.module.css";

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
        <div className={styles.select} ref={containerRef} tabIndex={0} onBlur={handleBlur}>
            <button className={styles.selectInput} onClick={() => setOpen((val) => !val)} style={style}>
                <div style={options.find((o) => o.value === value)?.style}>{value}</div>
            </button>
            <div className={styles.selectDropdown + (open ? " " + styles.open : "")} onBlur={() => console.log("Blur Dropdown")}>
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
            <svg className={styles.selectArrow} xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 -960 960 960" width="24px" fill="#e8eaed">
                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
            </svg>
        </div>
    );
};
