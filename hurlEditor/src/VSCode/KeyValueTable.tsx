import { CSSProperties, FC, FocusEventHandler, useState } from "react";
import styles from "./KeyValueTable.module.css";
import { Button } from "./Button";
import { TextField } from "./Textfield";

type KeyValueTableProps = {
    initialData: Record<string, string>;
    style?: CSSProperties;
};

export const KeyValueTable: FC<KeyValueTableProps> = ({ initialData }) => {
    const [data, setData] = useState<Record<string, string>>(initialData);
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingCol, setEditingCol] = useState<number>(0);

    const onBlur: FocusEventHandler<HTMLDivElement> = (e) => {
        if (!e.currentTarget?.parentNode?.contains(e.relatedTarget)) {
            setEditingKey(null);
            setEditingCol(0);
        }
    };

    const editKey = (newValue: string, key: string) => {
        if (newValue !== key && newValue !== "") {
            setData((prev) => {
                const newData: Record<string, string> = {};
                for (const [k, v] of Object.entries(prev)) {
                    if (k === key) {
                        newData[newValue] = v;
                    } else {
                        newData[k] = v;
                    }
                }
                return newData;
            });
            setEditingKey(newValue);
        }
    };

    return (
        <>
            <table className={styles.table}>
                <tbody>
                    <tr className={styles.row}>
                        <th className={styles.header}>Key</th>
                        <th className={styles.header}>Value</th>
                    </tr>
                    {Object.entries(data).map(([key, value]) => (
                        <tr
                            className={styles.row}
                            key={key}
                            onBlur={(e) => {
                                onBlur(e);
                                if (key === "") {
                                    const newData = { ...data };
                                    delete newData[""];
                                    setData(newData);
                                }
                            }}>
                            <EditableCell
                                className={styles.key}
                                value={key}
                                onChange={(newValue) => editKey(newValue, key)}
                                onDoubleClick={() => {
                                    setEditingKey(key);
                                    setEditingCol(0);
                                }}
                                editing={editingKey === key && editingCol === 0}
                                focus={editingKey === key && editingCol === 0}
                            />
                            <EditableCell
                                className={styles.value}
                                value={value}
                                onChange={(newValue) => {
                                    setData((prev) => ({ ...prev, [key]: newValue }));
                                }}
                                onDoubleClick={() => {
                                    setEditingKey(key);
                                    setEditingCol(1);
                                }}
                                editing={editingKey === key && editingCol === 1}
                                focus={editingKey === key && editingCol === 1}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button
                style={{ padding: "2px 14px", marginTop: "12px" }}
                onClick={() => {
                    setData((prev) => ({ ...prev, "": "" }));
                    setEditingKey("");
                    setEditingCol(0);
                }}>
                Add Item
            </Button>
        </>
    );
};

type EditableCellProps = {
    value: string;
    onChange: (newValue: string) => void;
    className: string;
    editing: boolean;
    focus: boolean;
    onDoubleClick: () => void;
};

const EditableCell: React.FC<EditableCellProps> = ({ value, onChange, className, editing, focus, onDoubleClick }) => {
    return (
        <td onDoubleClick={onDoubleClick} className={className}>
            {editing ? (
                <TextField value={value} onChange={(e) => onChange(e.target.value)} autoFocus={focus} />
            ) : (
                <div style={{ padding: "1px", border: "solid 1px transparent" }}>{value}</div>
            )}
        </td>
    );
};
