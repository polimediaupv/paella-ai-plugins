import ReactDOM from "react-dom";
import React, { useState, useEffect, useRef } from "react";
import "./AITools.css";
import Chat from "./Chat.jsx";
import TabContainer, { TabItem } from "./TabContainer.jsx";
import AIToolView from "./AIToolView.jsx"
import AIToolPodcast from "./AIToolPodcast.jsx";

const CloseIcon = () => {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" width="24" height="24" stroke-width="2">
        <path d="M18 6l-12 12"></path>
        <path d="M6 6l12 12"></path>
    </svg>)
}

const AIWindow = ({paellaPlugin}) => {
    const model = 'Llama-3.1-8B-Instruct-q4f32_1-MLC';
    const baseUrl = "webllm";
    const dialogRef = useRef();

    const showDialog = () => {
        console.log("show dialog");
        dialogRef.current?.show();
    }

    const hideDialog = () => {
        console.log("hide dialog");
        dialogRef.current?.close();
    }

    useEffect(() => {
        const showListener = () => {
            showDialog();
        }
        const hideListener = () => {
            hideDialog();
        }

        window.addEventListener("paella-ai-tools:show", showListener);
        window.addEventListener("paella-ai-tools:hide", hideListener);

        return () => {
            window.removeEventListener("paella-ai-tools:show", showListener);
            window.removeEventListener("paella-ai-tools:hide", hideListener);
        }
    }, []);

    return <dialog ref={dialogRef}>
        <div className="dialog-content">
            <header>
                <button onClick={() => hideDialog()}><CloseIcon /></button>
            </header>
            <TabContainer>
                { paellaPlugin.summary && <TabItem label="Summary">
                    <AIToolView
                        markdown={paellaPlugin.summary}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                }
                <TabItem label="FAQ">
                    <AIToolView
                        markdown={paellaPlugin.faq}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                <TabItem label="Study plan">
                    <AIToolView
                        markdown={paellaPlugin.study_plan}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                <TabItem label="Timeline">
                    <AIToolView
                        markdown={paellaPlugin.timeline}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                <TabItem label="Podcast">
                    <AIToolPodcast data={paellaPlugin.podcast} podcastMediaUrl={`${paellaPlugin.player.repositoryUrl}/${paellaPlugin.player.videoId}/${paellaPlugin.podcast.fileInfo.media}`}/>
                </TabItem>

                <TabItem label="Chat">
                    <Chat
                        promptMessage={"Eres un asistente que resuelve dudas de los usuarios. Responde a la pregunta."}
                        model={model}
                        baseUrl={baseUrl}
                        className="ia-tools-tab-content"
                    />
                </TabItem>
            </TabContainer>
        </div>
    </dialog>
}

const AIToolsContainer = ({paellaPlugin}) => {    
    return  <AIWindow paellaPlugin={paellaPlugin} />
}

let g_aiToolsMain = null;

export default class AITools {
    static Get(parentContainer, paellaPlugin) {
        if (!g_aiToolsMain) {
            g_aiToolsMain = new AITools(parentContainer, paellaPlugin);
            setTimeout(() => g_aiToolsMain.show(), 50);
        }
        return g_aiToolsMain;
    }

    constructor(parentElement, paellaPlugin) {
        this._paellaPlugin = paellaPlugin;
        this._parentElement = parentElement;

        this._appRootElement = document.createElement('div');
        this._appRootElement.classList.add("ai-tools-container");
        
        this._parentElement.appendChild(this._appRootElement);
        const root = ReactDOM.createRoot(this._appRootElement);

        root.render(<AIToolsContainer paellaPlugin={paellaPlugin}/>);
    }

    show() {
        const evt = new CustomEvent("paella-ai-tools:show");
        window.dispatchEvent(evt);
    }

    hide() {
        const evt = new CustomEvent("paella-ai-tools:hide");
        window.dispatchEvent(evt);
    }

    get visible() {
        return this._appRootElement.querySelector("dialog")?.open;
    }
}