import React from "react";
import "./AIToolAlert.css";
import { usePaellaPlugin } from "./react-context";

export default function AIToolAlert() {

    const paellaPlugin = usePaellaPlugin();
    return (
        <div className="aitool-alert">                
            <p> <strong>Warning!</strong> This content has been created by an artificial intelligence tool.</p>
            <p>While it may be useful as a starting point, it is essential that you check it against other reliable sources.</p>
            <p>The information provided here should be verified with additional sources before making any important decisions.</p>
        </div>
    )
}