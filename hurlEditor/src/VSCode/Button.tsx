import { CSSProperties, FunctionComponent, PropsWithChildren } from "react";
import styles from "./Button.module.css";

type ButtonProps = {
    onClick: () => void;
    style?: CSSProperties;
};

export const Button: FunctionComponent<PropsWithChildren<ButtonProps>> = ({ onClick, style, children }) => {
    return (
        <button className={styles.button} style={style} onClick={onClick}>
            {children}
        </button>
    );
};
