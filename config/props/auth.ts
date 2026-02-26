export interface meta {
    device?: string;
    location?: string;
    via?: string;
    isMobile?: boolean;
}
export interface LoginCredentials {
    email: string;
    password: string;
    meta?: meta
}

export type signupStep1 = {
    fullname: string;
    email: string;
    username: string;
    phoneNumber: string;
}


export interface RegisterData extends signupStep1 {
    password: string;
}


export interface OtpData {
    email: string;
    otp: string;
    returnToken?: boolean;
}




export interface ResetPasswordData {
    email: string;
    token: string;
    password: string;
}

export interface ChangePasswordData {
    isMobile?: boolean;
    confirmPassword: string;
    oldPassword: string;
    newPassword: string;
}

export interface ChangeEmailData {
    newEmailAddress: string;
    password: string;
    otp: string;
}

export interface User {
    id: string;
    fullname: string;
    email: string;
    username?: string;
    phoneNumber?: string;
    state?: string;
    isSeller?: boolean;
    store?: string;
    branch?: string;
    avatar?: any;
    isVerified?: boolean;
    twoFactorEnabled?: boolean;
}

export interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    loading: boolean;
    error: string | null;
}
