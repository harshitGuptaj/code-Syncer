enum VIEWS {
    FILES = "FILES",
    CLIENTS = "CLIENTS",
    RUN = "RUN",
    SETTINGS = "SETTINGS",
    CHATS = "CHATS",
    COPILOT = "COPILOT",
    DRAWING = "DRAWING",
}

interface ViewContext {
    activeView: VIEWS
    setActiveView: (activeView: VIEWS) => void
    isSidebarOpen: boolean
    setIsSidebarOpen: (isSidebarOpen: boolean) => void
    viewComponents: { [key in VIEWS]: JSX.Element }
    viewIcons: { [key in VIEWS]: JSX.Element }
}

export { ViewContext, VIEWS }
