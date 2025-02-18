import { ChangeEventHandler, CSSProperties, FunctionComponent } from "react";
import styles from "./Textfield.module.css";
type TextFieldProps = {
    value: string;
    style?: CSSProperties;
    onChange: ChangeEventHandler<HTMLInputElement>;
    placeholder: string;
};

export const TextField: FunctionComponent<TextFieldProps> = ({ value, style, placeholder, onChange }) => {
    return <input className={styles.textfield} value={value} onChange={onChange} placeholder={placeholder} style={style}></input>;
};
