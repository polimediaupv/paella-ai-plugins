import { DataPlugin } from 'paella-core';

import AIToolsModule from './AIToolsModule';

export default class AIToolsFileDataPlugin extends DataPlugin {
    getPluginModuleInstance() {
        return AIToolsModule.Get();
    }

    get name() {
        return super.name || "es.upv.paella.aitools.fileDataPlugin";
    }    

    async read(context, keyParams) {        
        if (!this.config.files) {
            this.player.log.error("AIToolsFileDataPlugin.read: no files configured");
        }
        else if (!keyParams in this.config.files) {
            this.player.log.error(`AIToolsFileDataPlugin.read: scope ${keyParams} not configured in files`);
        }
        else {
            let fileInfo = this.config.files[keyParams];
            let url = `${this.player.repositoryUrl}/${this.player.videoId}/${fileInfo.file}`;

            // Read the file content
            let content = await fetch(url)
                .then(async (response) => {
                    if (!response.ok) {
                        return null
                    }
                    else {
                        return await response.text();
                    }
                });

            return {
                fileInfo: fileInfo,
                content
            };
        }

        return null;
    }

    async write(context, keyParams, data) {
        this.player.log.error("AIToolsFileDataPlugin.write: not implemented");
    }

    async remove(context, keyParams) {
        this.player.log.error("AIToolsFileDataPlugin.remove: not implemented");
    }
}