import "./TabContainer.css";
import React, { useState } from "react";

export const TabItem = ({ label, children, enabled = true }) => (
    <div
        className="tab-panel"
        role="tabpanel"
        aria-labelledby={`tab-${label}`}
    >
        {children}
    </div>
)

const TabContainer = ({ children, activeTabIndex = 0 }) => {
    const [activeTab, setActiveTab] = useState(activeTabIndex);
    const handleTabClick = (index) => {
        setActiveTab(index);
    }

    const tabs = React.Children.toArray(children)
        .filter((child) => {
            return React.isValidElement(child) && child.type === TabItem && (child.props.enabled !== undefined ? child.props.enabled : true);
        })

    return <div className="tab-container">
        <nav>
            <ul>
                {tabs.map((tab, index) => (
                    <li key={`tab-${index}`}>
                        <button
                            className={`tab-btn ${ activeTab === index && "tab-btn-active"}`}
                            onClick={() => handleTabClick(index)}
                        >
                            {tab.props.label}
                        </button>
                    </li>
                ))}
            </ul>
        </nav>
        <div>
            {tabs[activeTab]}
        </div>
    </div>
}

export default TabContainer;