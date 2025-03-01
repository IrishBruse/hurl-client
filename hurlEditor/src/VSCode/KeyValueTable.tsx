import { CSSProperties, FC, FocusEventHandler, useEffect, useState } from "react";
import styles from "./KeyValueTable.module.css";
import { Button } from "./Button";
import { TextField } from "./Textfield";

type Row = {
    key: string;
    value: string;
};

type KeyValueTableProps = {
    value: Record<string, string>;
    onChange: (value: Record<string, string>) => void;
    style?: CSSProperties;
};

export const KeyValueTable: FC<KeyValueTableProps> = ({ value, onChange }) => {
    const [rows, setRows] = useState<Row[]>(() => Object.entries(value).map(([k, v]) => ({ key: k, value: v })));
    const [editingKey, setEditingKey] = useState<string | null>(null);
    const [editingCol, setEditingCol] = useState<number>(0);

    useEffect(() => {
        const changed = {} as Record<string, string>;

        for (const element of rows) {
            changed[element.key] = element.value;
        }

        onChange(changed);
    }, [rows]);

    const onBlurHandler: FocusEventHandler<HTMLTableRowElement> = (e) => {
        if (!e.currentTarget.parentNode?.contains(e.relatedTarget)) {
            setEditingKey(null);
            setEditingCol(0);
        }
    };

    const handleDragStart = (e: React.DragEvent<HTMLTableRowElement>, index: number) => {
        e.dataTransfer.setData("drag-index", index.toString());
        e.dataTransfer.effectAllowed = "move";
    };

    const handleDragOver = (e: React.DragEvent<HTMLTableRowElement>) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = "move";
    };

    const handleDrop = (e: React.DragEvent<HTMLTableRowElement>, dropIndex: number) => {
        e.preventDefault();
        const dragIndexStr = e.dataTransfer.getData("drag-index");
        const dragIndex = Number(dragIndexStr);
        if (isNaN(dragIndex)) {
            return;
        }
        setRows((prev) => {
            const newRows = [...prev];
            const [draggedItem] = newRows.splice(dragIndex, 1);
            newRows.splice(dropIndex, 0, draggedItem);
            return newRows;
        });
    };

    const editKey = (newValue: string, index: number) => {
        if (newValue !== rows[index].key && newValue !== "") {
            setRows((prev) => {
                const newRows = [...prev];
                newRows[index] = { ...newRows[index], key: newValue };
                return newRows;
            });
            setEditingKey(newValue);
        }
    };

    const editValue = (newValue: string, index: number) => {
        setRows((prev) => {
            const newRows = [...prev];
            newRows[index] = { ...newRows[index], value: newValue };
            return newRows;
        });
    };

    return (
        <>
            <table className={styles.table}>
                <thead>
                    <tr className={styles.row}>
                        <th className={styles.header}>Key</th>
                        <th className={styles.header}>Value</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row, index) => (
                        <tr
                            key={row.key || index}
                            className={styles.row}
                            draggable
                            onDragStart={(e) => handleDragStart(e, index)}
                            onDragOver={handleDragOver}
                            onDrop={(e) => handleDrop(e, index)}
                            onBlur={(e) => {
                                onBlurHandler(e);
                                // If the key is empty when losing focus, remove the row.
                                if (row.key === "") {
                                    setRows((prev) => prev.filter((_, i) => i !== index));
                                }
                            }}>
                            <EditableCell
                                className={styles.key}
                                value={row.key}
                                onChange={(newValue) => editKey(newValue, index)}
                                onDoubleClick={() => {
                                    setEditingKey(row.key);
                                    setEditingCol(0);
                                }}
                                editing={editingKey === row.key && editingCol === 0}
                                focus={editingKey === row.key && editingCol === 0}
                            />
                            <EditableCell
                                className={styles.value}
                                value={row.value}
                                onChange={(newValue) => editValue(newValue, index)}
                                onDoubleClick={() => {
                                    setEditingKey(row.key);
                                    setEditingCol(1);
                                }}
                                editing={editingKey === row.key && editingCol === 1}
                                focus={editingKey === row.key && editingCol === 1}
                            />
                        </tr>
                    ))}
                </tbody>
            </table>
            <Button
                style={{ padding: "2px 14px", marginTop: "12px" }}
                onClick={() => {
                    setRows((prev) => [...prev, { key: "", value: "" }]);
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

const EditableCell: FC<EditableCellProps> = ({ value, onChange, className, editing, focus, onDoubleClick }) => {
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
