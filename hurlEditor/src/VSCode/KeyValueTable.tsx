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
    const [editingRow, setEditingRow] = useState({ row: -1, col: 0 });

    const onBlur: FocusEventHandler<HTMLDivElement> = (e) => {
        if (!e.currentTarget?.parentNode?.contains(e.relatedTarget)) {
            setEditingRow(-1);
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
                    {Object.entries(data).map(([key, value], row) => {
                        return (
                            <tr className={styles.row} key={key} onBlur={onBlur}>
                                <EditableCell
                                    onDoubleClick={() => setEditingRow({ row, col: 0 })}
                                    value={key}
                                    editing={row === editingRow.row}
                                    focus={editingRow.col === 0}
                                />
                                <EditableCell
                                    onDoubleClick={() => setEditingRow({ row, col: 1 })}
                                    value={value}
                                    editing={row === editingRow.row}
                                    focus={editingRow.col === 1}
                                />
                            </tr>
                        );
                    })}
                </tbody>
            </table>
            <Button
                style={{ padding: "2px 14px", marginTop: "12px" }}
                onClick={() => {
                    setData((prev) => {
                        return { ...prev, __EMPTY__: "" };
                    });
                }}>
                Add Item
            </Button>
        </>
    );
};

type EditableCellProps = {
    value: string;
    editing: boolean;
    focus: boolean;
    onDoubleClick: () => void;
};

const EditableCell: React.FC<EditableCellProps> = ({ value, editing, focus, onDoubleClick }) => {
    return (
        <td onDoubleClick={onDoubleClick}>
            {editing ? (
                <TextField placeholder="key" onChange={() => {}} autoFocus={focus} value={value} style={{ padding: "2px 1px", marginRight: "12px" }} />
            ) : (
                <div style={{ padding: "2px 1px" }}>{value}</div>
            )}
        </td>
    );
};
