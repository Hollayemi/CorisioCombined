import { Route } from "expo-router";

export type ProfileItem = {
    id: number;
    name: string;
    type: 'link' | 'toggle';
    to?: Route;
    value?: boolean;
    key?: string;
};

const accountInfo: ProfileItem[] = [
    { id: 1, name: "Pickers", type: "link", to: "/user/profile/picker" },
    { id: 2, name: "Shipping Addresses", type: "link", to: "/user/profile/address" },
    { id: 3, name: "Followed Sellers", type: "link", to: "/user/profile" },
];

export default accountInfo

export const productManagement: ProfileItem[] = [
    { id: 1, name: "Orders", type: "link", to: "/user/order" },
    { id: 2, name: "Pending Reviews", type: "link", to: "/user/order/review" },
    { id: 3, name: "Vouchers", type: "link", to: "/user/profile" },
    { id: 4, name: "Saved Items", type: "link", to: "/user/profile/savedItems" },
    { id: 5, name: "Recently Viewed", type: "link", to: "/user/profile/recentlyViewed" },
];

export const accountManagement: ProfileItem[] = [
    {
        id: 1,
        name: "Change Phone Number",
        type: "link",
        to: "/user/profile/account/changePhoneNumber",
    },
    { id: 2, name: "Change Password", type: "link", to: "/user/profile/account/changePassword" },
    {
        id: 3,
        name: "Change Email Address",
        type: "link",
        to: "/user/profile/account/changeEmail",
    },
    {
        id: 4,
        name: "Two-Factor Authentication",
        type: "link",
        to: "/user/profile/2fa",
    },
];

export const accountManagement1: ProfileItem[] = [
    {
        id: 1,
        name: "Customer Support",
        type: "link",
        to: "/user/profile/customerSupport",
    },
    { id: 2, name: "Delete Account", type: "link", to: "/user/profile/deleteAccount" },
];

export const notificatiionPrefernce: ProfileItem[] = [
    {
        id: 1,
        name: "Push Notifications",
        type: "toggle",
        value: true,
        key: "push_notification",
    },
    {
        id: 2,
        name: "Email Notifications",
        type: "toggle",
        value: true,
        key: "email_notification",
    },
];