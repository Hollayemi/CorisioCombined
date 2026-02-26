import { Days, SocialMedia, StoreDataTypes } from "@/app/home/settings";

export interface ApiResponse<T> {
    success: boolean;
    type: 'success' | 'error';
    data: T;
    message: string;
}

export interface otpAction {
    account?: "business" | "staff";
    to?: "email-verification" | "phone-verification";
}

export interface setCoordinates {
    type: string;
    coordinates: any;
}

export interface setCoordinatesPayload {
    coordinates: any;
    street?: string;
    city?: string;
    state?: string;
    address?: string;

}


export interface reqStaffInfo {
    username: string;
    fullname: string;
    email: string;
    password: string;
};
export interface regStoreInfo {
    store: string;
    businessName: string;
    businessEmail: string;
    about_store: string;
    categories: any;
    coordinates: setCoordinates;
    street?: string;
    city?: string;
    state?: string;
    address?: string;
};

export interface updateOrderPayload {
    orderId: string;
    comment?: string;
    status: string;
    pickerSlug: string;
}

export interface storeUpdatePayload extends StoreDataTypes {
    social_media: SocialMedia;
    opening_hours: Days;
}