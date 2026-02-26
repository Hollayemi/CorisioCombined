import React, { useEffect } from 'react';
import { Alert, Text, TouchableOpacity } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import * as Crypto from 'expo-crypto';

// Complete the auth session for Android
WebBrowser.maybeCompleteAuthSession();

interface GoogleOAuthProps {
    onSuccess: (tokens: { accessToken: string; idToken?: string; refreshToken?: string }) => void;
    onError: (error: string) => void;
    onCancel: () => void;
    clientId: string;
    redirectUri?: string;
}

const GoogleOAuth = ({
    onSuccess,
    onError,
    onCancel,
    clientId,
    redirectUri
}: GoogleOAuthProps) => {

    // Use Expo's default redirect URI if none provided
    const defaultRedirectUri = AuthSession.makeRedirectUri({
        useProxy: true, // Use Expo's proxy in development
    });

    const finalRedirectUri = redirectUri || defaultRedirectUri;

    console.log({ finalRedirectUri })

    // OAuth configuration
    const [request, response, promptAsync] = AuthSession.useAuthRequest(
        {
            clientId,
            scopes: ['openid', 'profile', 'email'], // Minimal scopes to avoid verification issues
            redirectUri: finalRedirectUri,
            responseType: AuthSession.ResponseType.Code,
            // PKCE configuration for security
            codeChallenge: '',
            codeChallengeMethod: AuthSession.CodeChallengeMethod.S256,
            // Additional parameters to help with verification
            additionalParameters: {
                access_type: 'offline', // Get refresh token
                prompt: 'consent', // Force consent screen
                include_granted_scopes: 'true', // Incremental authorization
            },
        },
        {
            authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
            tokenEndpoint: 'https://oauth2.googleapis.com/token',
            revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
        }
    );

    // Handle the OAuth response
    useEffect(() => {
        if (response?.type === 'success') {
            const { code } = response.params;

            if (code) {
                // Exchange authorization code for tokens
                exchangeCodeForTokens(code);
            }
        } else if (response?.type === 'error') {
            onError(response.error?.message || 'OAuth failed');
        } else if (response?.type === 'cancel') {
            onCancel();
        }
    }, [response]);

    // Exchange authorization code for access token
    const exchangeCodeForTokens = async (code: string) => {
        try {
            const tokenResponse = await AuthSession.exchangeCodeAsync(
                {
                    clientId,
                    code,
                    redirectUri: finalRedirectUri,
                    extraParams: {
                        code_verifier: request?.codeVerifier || '',
                    },
                },
                {
                    tokenEndpoint: 'https://oauth2.googleapis.com/token',
                }
            );

            if (tokenResponse.accessToken) {
                onSuccess({
                    accessToken: tokenResponse.accessToken,
                    idToken: tokenResponse.idToken,
                    refreshToken: tokenResponse.refreshToken,
                });
            } else {
                onError('Failed to get access token');
            }
        } catch (error) {
            console.error('Token exchange error:', error);
            onError('Failed to exchange authorization code');
        }
    };

    // Start the OAuth flow
    const startOAuth = async () => {
        try {
            const result = await promptAsync();
            // Response is handled in useEffect
        } catch (error) {
            console.error('OAuth error:', error);
            onError('Failed to start OAuth flow');
        }
    };

    // Return the function to start OAuth (you can call this from a button)
    return { startOAuth, isLoading: !request };
};

export default GoogleOAuth;

// Usage example component:
export const GoogleAuthButton = () => {
    const { startOAuth, isLoading } = GoogleOAuth({
        clientId: '60763179096-3u9f3p9miemrvr2mq1a05gv247ajb6lh.apps.googleusercontent.com', // Replace with your Google Client ID
        onSuccess: (tokens) => {
            console.log('OAuth Success:', tokens);
            Alert.alert('Success', 'Authentication successful!');
        },
        onError: (error) => {
            console.error('OAuth Error:', error);
            Alert.alert('Error', error);
        },
        onCancel: () => {
            console.log('OAuth Cancelled');
            Alert.alert('Cancelled', 'Authentication cancelled');
        },
    });

    return (
        <TouchableOpacity
            onPress={startOAuth}
            disabled={isLoading}
            style={{
                backgroundColor: '#4285F4',
                padding: 12,
                borderRadius: 8,
                alignItems: 'center',
                opacity: isLoading ? 0.7 : 1,
            }}
        >
            <Text style={{ color: 'white', fontSize: 16 }}>
                {isLoading ? 'Loading...' : 'Sign in with Google'}
            </Text>
        </TouchableOpacity>
    );
};