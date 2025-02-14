import {createRoot} from "react-dom/client";
import React, { useState, useEffect, useRef } from "react";
import "./AITools.css";
import AIToolChat from "./AIToolChat.jsx";
import TabContainer, { TabItem } from "./TabContainer.jsx";
import AIToolView from "./AIToolView.jsx"
import AIToolPodcast from "./AIToolPodcast.jsx";
import { PaellaPluginProvider, usePaellaPlugin } from "./react-context.js";


const CloseIcon = () => {
    return (<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" width="24" height="24" strokeWidth="2">
        <path d="M18 6l-12 12"></path>
        <path d="M6 6l12 12"></path>
    </svg>)
}

const AIWindow = () => {
    const dialogRef = useRef();

    const paellaPlugin = usePaellaPlugin();
    
    const showDialog = () => {
        dialogRef.current?.show();
    }

    const hideDialog = () => {
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
                { paellaPlugin.summary && <TabItem label={paellaPlugin.player.translate("Summary")}>
                    <AIToolView
                        markdown={paellaPlugin.summary.content}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                }
                { paellaPlugin.faq && <TabItem label={paellaPlugin.player.translate("FAQ")}>
                    <AIToolView
                        markdown={paellaPlugin.faq.content}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                }
                { paellaPlugin.study_plan && <TabItem label={paellaPlugin.player.translate("Study plan")}>
                    <AIToolView
                        markdown={paellaPlugin.study_plan.content}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                }
                { paellaPlugin.timeline && <TabItem label={paellaPlugin.player.translate("Timeline")}>
                    <AIToolView
                        markdown={paellaPlugin.timeline.content}
                        options={{ tables: true, emoji: true }}
                    />
                </TabItem>
                }
                { paellaPlugin.podcast?.content && <TabItem label={paellaPlugin.player.translate("Podcast")}>
                    <AIToolPodcast data={paellaPlugin.podcast} podcastMediaUrl={`${paellaPlugin.player.repositoryUrl}/${paellaPlugin.player.videoId}/${paellaPlugin.podcast.fileInfo.media}`}/>
                </TabItem>
                }
                { paellaPlugin.config?.chat?.enabled && <TabItem label={paellaPlugin.player.translate("Chat")}>
                    <AIToolChat className="ia-tools-tab-content" />
                </TabItem>
                }
            </TabContainer>
        </div>
    </dialog>
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
        const root = createRoot(this._appRootElement);

        root.render(
            <PaellaPluginProvider value={paellaPlugin}>
                <AIWindow />
            </PaellaPluginProvider>
        );
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