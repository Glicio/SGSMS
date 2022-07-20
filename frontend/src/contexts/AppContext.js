import React, {createContext, useState} from "react";

const AppContext = createContext()

export default function AppProvider({children}) {
    const [version, setVersion] = useState("")
    const providerData ={
        version: version,
        setVersion: setVersion
    }
    return(
    <AppContext.Provider value={providerData}>
        {children}
    </AppContext.Provider>
    )
}