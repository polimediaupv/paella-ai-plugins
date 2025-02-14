import React, { useContext } from 'react'

const PaellaPluginContext = React.createContext(null)
export const PaellaPluginProvider = PaellaPluginContext.Provider

export const usePaellaPlugin = () => {
    const paellaPlugin = useContext(PaellaPluginContext)
    return paellaPlugin
}