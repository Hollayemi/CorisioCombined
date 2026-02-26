import { SDUIService } from "@/app/business/sdui/service";
import { UIComponentData } from "@/app/business/sdui/types";
import { useCallback, useEffect, useState } from "react";

// Main SDUI Engine Hook
export const useSDUI = (screenName: string, userType?: string, appVersion?: string) => {
    const [components, setComponents] = useState<UIComponentData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const sduiService = new SDUIService();

    const fetchComponents = useCallback(async () => {
        setLoading(true);
        setError(null);

        try {
            const fetchedComponents = await sduiService.getComponents(
                screenName,
                userType,
                appVersion
            );
            setComponents(fetchedComponents);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unknown error');
        } finally {
            setLoading(false);
        }
    }, [screenName, userType, appVersion]);

    useEffect(() => {
        fetchComponents();
    }, [fetchComponents]);

    const dismissComponent = useCallback((componentId: string) => {
        setComponents(prev => prev.filter(comp => comp.id !== componentId));
        sduiService.trackAnalytics(componentId, 'dismissal');
    }, []);

    return {
        components,
        loading,
        error,
        refreshComponents: fetchComponents,
        dismissComponent,
    };
};