import { ChangeEventHandler, CSSProperties, FunctionComponent } from "react";
import styles from "./Textfield.module.css";
type TextFieldProps = {
    value: string;
    style?: CSSProperties;
    onChange: ChangeEventHandler<HTMLInputElement>;
    placeholder: string;
    autoFocus?: boolean;
};

export const TextField: FunctionComponent<TextFieldProps> = ({ value, style, placeholder, autoFocus, onChange }) => {
    return <input className={styles.textfield} value={value} onChange={onChange} placeholder={placeholder} autoFocus={autoFocus} style={style}></input>;
};
