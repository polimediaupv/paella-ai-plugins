import React from "react";
import "./AIToolView.css";
import MarkdownView from 'react-showdown';

export default function AIToolView({markdown, options}) {
    return (
        <div
            className="aitool-view"
        >
            <MarkdownView
                markdown={markdown}
                options={options}
            />
        </div>
    )
}