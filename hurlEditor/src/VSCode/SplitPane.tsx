import { useState, useRef, useEffect, FC, ReactElement } from "react";
import styles from "./SplitPane.module.css";

type SplitPaneProps = {
    initialWidth: number;
    minLeft: number;
    minRight: number;
    children: ReactElement[];
};

export const SplitPane: FC<SplitPaneProps> = ({ initialWidth: initialLeftWidth, minLeft, minRight, children }) => {
    const containerRef = useRef<HTMLDivElement>(null!);
    const [leftWidth, setLeftWidth] = useState(initialLeftWidth);
    const dragging = useRef(false);

    const onMouseMove = (e: MouseEvent) => {
        if (!dragging.current || !containerRef.current) {
            return;
        }
        const containerRect = containerRef.current.getBoundingClientRect();
        let newLeftWidth = e.clientX - containerRect.left;
        const containerWidth = containerRect.width;

        if (newLeftWidth < minLeft) {
            newLeftWidth = minLeft;
        }
        if (newLeftWidth > containerWidth - minRight) {
            newLeftWidth = containerWidth - minRight;
        }

        setLeftWidth(newLeftWidth);
    };

    const onMouseUp = () => {
        dragging.current = false;
        document.body.style.userSelect = "auto"; // Re-enable text selection
        document.removeEventListener("mousemove", onMouseMove);
        document.removeEventListener("mouseup", onMouseUp);
    };

    const onMouseDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
        e.preventDefault(); // Prevent default behavior that may cause text selection
        dragging.current = true;
        document.body.style.userSelect = "none"; // Disable text selection
        document.addEventListener("mousemove", onMouseMove);
        document.addEventListener("mouseup", onMouseUp);
    };

    // Clean up event listeners on unmount
    useEffect(() => {
        return () => {
            document.body.style.userSelect = "auto";
            document.removeEventListener("mousemove", onMouseMove);
            document.removeEventListener("mouseup", onMouseUp);
        };
    }, []);

    return (
        <div
            ref={containerRef}
            style={{
                display: "flex",
                width: "100%",
                height: "100%",
                overflow: "hidden",
                position: "relative",
            }}>
            <div style={{ width: leftWidth, overflow: "auto" }}>{children[0]}</div>
            <div
                className={styles.sash + " " + styles.vertical}
                onMouseDown={onMouseDown}
                onDoubleClick={() => {
                    setLeftWidth(containerRef.current.clientWidth / 2);
                }}
            />
            <div style={{ flex: 1, overflow: "auto" }}>{children[1]}</div>
        </div>
    );
};
