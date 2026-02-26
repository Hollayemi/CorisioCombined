// Types
export interface SDUIComponent {
    type: string;
    props?: Record<string, any>;
    children?: SDUIComponent[] | string;
}

export interface UIComponentData {
    id: string;
    type: 'notification' | 'form' | 'banner' | 'modal' | 'content';
    priority: number;
    uiDefinition: SDUIComponent;
}

export interface SDUIEngineProps {
    screenName: string;
    userType?: string;
    appVersion?: string;
    onComponentAction?: (action: any, componentId: string) => void;
}
