import React from "react";
import "./AIToolView.css";
import AIToolAlert from "./AIToolAlert.jsx";
import MarkdownView from 'react-showdown';

export default function AIToolView({markdown, options}) {
    return (
        <div
            className="aitool-view"
        >
            <AIToolAlert />
            <MarkdownView
                markdown={markdown}
                options={options}
            />
        </div>
    )
}