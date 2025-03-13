import { CSSProperties, FC, FunctionComponent } from "react";
import styles from "./Setting.module.css";
import { TextField } from "./Textfield";

export type SettingType = "string" | "integer" | "boolean" | "file" | "number";

type SettingProps = {
    value: string;
    onChange: (value: string) => void;
    type: SettingType;
    name: string;
    description: string;
    style?: CSSProperties;
};

export const Setting: FunctionComponent<SettingProps> = ({ value, onChange, name, type, description, style }) => {
    const SettingComponent = SettingComponentType[type];
    return (
        <div style={{ display: "flex", flexDirection: "column", padding: "1rem 0" }} key={name}>
            <span style={{ fontWeight: 600, color: "var(--vscode-settings-headerForeground)" }}>{name}</span>
            <SettingComponent value={value} onChange={onChange} description={description} />
        </div>
    );
};

type SettingComponentProps = {
    value: string;
    onChange: (value: string) => void;
    description: string;
};

const BooleanSettings: FC<SettingComponentProps> = ({ value, onChange, description }) => {
    return (
        <label className={styles.booleanSetting}>
            <div className={styles.checkboxContainer}>
                <input type="checkbox" className={styles.checkbox} />
                <span className={styles.checkmark}></span>
            </div>
            <div className={styles.description}>{description}</div>
        </label>
    );
};

const StringSettings: FC<SettingComponentProps> = ({ value, onChange, description }) => {
    return (
        <label className={styles.stringSetting}>
            <div className={styles.description} style={{ paddingBottom: "2px" }}>
                {description}
            </div>
            <TextField value="" onChange={() => {}} style={{ width: "auto" }} />
        </label>
    );
};

const SettingComponentType: Record<SettingType, FC<SettingComponentProps>> = {
    boolean: BooleanSettings,
    string: StringSettings,
    file: ({ description }) => <div>{description}</div>,
    integer: ({ description }) => <div>{description}</div>,
    number: ({ description }) => <div>{description}</div>,
};
