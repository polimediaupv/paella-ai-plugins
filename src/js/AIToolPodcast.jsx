import React from "react";
import "./AIToolPodcast.css";
import AIToolAlert from "./AIToolAlert.jsx";
export default function AIToolPodcast({data, podcastMediaUrl}) {
    let script;
    try {
        script = JSON.parse(data.content)
    }
    catch (e) {}
    
    return (
        <div
            className="aitool-podcast"
        >
            <AIToolAlert />
            { podcastMediaUrl &&
                <audio controls>
                    <source src={podcastMediaUrl} type="audio/ogg" />
                    Your browser does not support the audio element.
                </audio>
            }
            { script && script.length > 0 &&
                <ul>
                    { script.map((item, index) => 
                        <li>
                            <div className="speaker"> {item.speaker} </div>
                            <div className="text"> {item.text} </div>
                        </li>
                    )}
                </ul>
}
        </div>
    )
}