import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { SDUIService } from "./service";
import { Button, ScrollView, Text, TextInput, View } from "react-native";
import { TouchableOpacity } from "react-native";
import { Image } from "react-native";

interface SDUIComponent {
    type: string;
    props?: Record<string, any>;
    children?: SDUIComponent[] | string;
}

const SDUIButton: React.FC<{
    title: string;
    onPress: () => void;
    className?: string;
    titleClassName?: string;
}> = ({ title, onPress, className, titleClassName }) => (
    <TouchableOpacity
        onPress={onPress}
        className={className || 'bg-blue-500 px-4 py-2 rounded'}
    >
        <Text className={titleClassName || 'text-white text-center font-semibold'}>
            {title}
        </Text>
    </TouchableOpacity>
);

// Main SDUI Renderer Component
export const SDUIRenderer: React.FC<{
    component: SDUIComponent;
    componentId: string;
    onAction?: (action: any) => void;
}> = ({ component, componentId, onAction }) => {

    // Component registry
    const COMPONENT_REGISTRY: Record<string, React.ComponentType<any>> = {
        View,
        Text,
        Button: SDUIButton,
        TextInput,
        TouchableOpacity,
        ScrollView,
        Image,
    };

    const handleAction = useCallback((action: any) => {
        if (action?.action === 'navigate' && action.params?.screen) {
            router.push(action.params.screen);
        } else if (action?.action === 'dismiss') {
            // Handle dismiss logic
            onAction?.(action);
        } else if (action?.action === 'submit') {
            // Handle form submission
            onAction?.(action);
        }

        // Track analytics
        if (action) {
            const sduiService = new SDUIService();
            sduiService.trackAnalytics(componentId, 'click');
        }
    }, [router, componentId, onAction]);

    const renderComponent = (comp: SDUIComponent): React.ReactElement | null => {
        if (typeof comp === 'string') {
            return null;
        }

        const ComponentType = COMPONENT_REGISTRY[comp.type];

        if (!ComponentType) {
            console.warn(`Unknown component type: ${comp.type}`);
            return null;
        }

        let props = { ...comp.props };

        // Handle onPress actions
        if (props.onPress && typeof props.onPress === 'object') {
            const originalOnPress = props.onPress;
            props.onPress = () => handleAction(originalOnPress);
        }

        // Special handling for SDUIButton
        if (comp.type === 'Button') {
            props = {
                title: typeof comp.children === 'string' ? comp.children : props.title || '',
                onPress: props.onPress,
                className: props.className,
                titleClassName: props.titleClassName,
            };
        }

        // Handle children
        let children = null;
        if (typeof comp.children === 'string' && comp.type !== 'Button') {
            children = comp.children;
        } else if (Array.isArray(comp.children)) {
            children = comp.children.map((child, index) => (
                <React.Fragment key={index}>
                    {renderComponent(child)}
                </React.Fragment>
            ));
        }

        return React.createElement(ComponentType as React.ComponentType<any>, props, children);
    };

    useEffect(() => {
        // Track impression
        const sduiService = new SDUIService();
        sduiService.trackAnalytics(componentId, 'impression');
    }, [componentId]);

    return renderComponent(component);
};


