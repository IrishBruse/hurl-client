import { CSSProperties, FunctionComponent, PropsWithChildren, ReactNode, useState } from "react";
import styles from "./Tabs.module.css";

type TabsProps = {
    tabs: string[];
    style?: CSSProperties;
    children: ReactNode[];
};

export const Tabs: FunctionComponent<TabsProps> = ({ tabs, children }) => {
    const [checked, setChecked] = useState(0);
    return (
        <>
            <ul className={styles.tabs}>
                {tabs.map((tab, i) => {
                    return (
                        <TabHeader
                            checked={checked === i}
                            key={tab}
                            onClick={() => {
                                setChecked(i);
                            }}>
                            {tab}
                        </TabHeader>
                    );
                })}
            </ul>
            <div className={styles.tabsContent}>{children && children[checked]}</div>
        </>
    );
};

type TabHeaderProps = {
    checked: boolean;
    onClick: () => void;
    style?: CSSProperties;
};

export const TabHeader: FunctionComponent<PropsWithChildren<TabHeaderProps>> = ({ checked, onClick, children }) => {
    return (
        <li className={styles.tabsHeader}>
            <a className={styles.tabsLink + " " + (checked ? styles.checked : "")} onClick={onClick}>
                {children}
            </a>
        </li>
    );
};
