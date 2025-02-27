import { CSSProperties, FunctionComponent } from "react";
import styles from "./Textfield.module.css";
type TextFieldProps = {
    value: string;
    style?: CSSProperties;
    onChange: (value: string) => void;
    placeholder?: string;
    name?: string;
    autoFocus?: boolean;
};

export const TextField: FunctionComponent<TextFieldProps> = ({ value, style, placeholder, name, autoFocus, onChange }) => {
    return (
        <input
            className={styles.textfield}
            value={value}
            onChange={(e) => onChange(e.target.value)}
            name={name}
            placeholder={placeholder}
            autoFocus={autoFocus}
            style={style}></input>
    );
};
