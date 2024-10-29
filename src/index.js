
import AIToolsPopUp from './plugins/es.upv.paella.aiToolsPopUpPlugin.js';

export default function geChatPluginContext() {
    return require.context("./plugins", true, /\.js/)
}

export const aiToolsPlugin = [
    {
        plugin: AIToolsPopUp,
        config: {
            enabled: false
        }
    }
];

export const allPlugins = aiToolsPlugin;

export const AIToolsPopUpPlugin = AIToolsPopUp;
