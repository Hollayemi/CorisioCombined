import { server } from "@/redux/business/slices/api/baseApi";
import { UIComponentData } from "./types";

class SDUIService {
    private baseUrl: string;
    constructor(baseUrl: string = 'http://localhost:3000') {
        this.baseUrl = server;
    }

    async getComponents(
        screenName: string,
        userType?: string,
        appVersion?: string
    ): Promise<UIComponentData[]> {
        try {
            const params = new URLSearchParams();
            if (userType) params.append('userType', userType);
            if (appVersion) params.append('appVersion', appVersion);

            const response = await fetch(
                `${this.baseUrl}/api/V1/sdui/${screenName}?${params}`
            );
            console.log(response)
            const data = await response.json();

            if (data.success) {
                return data.components;
            }
            throw new Error(data.error || 'Failed to fetch components');
        } catch (error) {
            console.error('SDUI Service Error:', error);
            return [];
        }
    }

    async trackAnalytics(
        componentId: string,
        action: 'impression' | 'click' | 'dismissal'
    ): Promise<void> {
        try {
            await fetch(`${this.baseUrl}/api/V1/sdui/${componentId}/analytics`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ action }),
            });
        } catch (error) {
            console.error('Analytics tracking error:', error);
        }
    }
}

export { SDUIService };
