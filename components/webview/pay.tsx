import React, { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  SafeAreaView,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { WebView } from 'react-native-webview';

interface PaymentModal {
  visible: boolean; 
  authorizationUrl: string, 
  onSuccess: any;
  onCancel:any; 
  onError: any;
}
const PaystackPaymentModal = ({   visible, 
  authorizationUrl, 
  onSuccess, 
  onCancel, 
  onError 
}: PaymentModal) => {
  console.log( visible, 
    authorizationUrl)
  const [isLoading, setIsLoading] = useState(true);
  const [canGoBack, setCanGoBack] = useState(false);
  const [currURL, setURL] = useState(authorizationUrl)
  const webViewRef = useRef<WebView>(null);

  // Handle URL changes to detect payment completion
  const handleNavigationStateChange = (navState:any) => {
    const { url } = navState;
    
    setCanGoBack(navState.canGoBack);

    console.log(url)

    if (url.includes('callback')) {
      console.log("to redirect", url)
      setURL(url)
    }
    
    // Check for success callback URL
    if (url.includes('completed') || url.includes('success')) {
      console.log("completed url", url)
      // Extract reference or transaction details from URL if needed
      const urlParams = new URLSearchParams(url.split('?')[1]);
      const payment = urlParams.get('payment');
      const status = urlParams.get('status');
      
      if (payment === 'completed') {
        onSuccess?.();
      } else {
        onError?.('Payment failed');
      }
    }
    
    // Check for cancellation
    if (url.includes('cancel') || url.includes('failed')) {
      onCancel?.();
    }
  };

  // Handle WebView errors
  const handleError = (syntheticEvent: any) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error: ', nativeEvent);
    onError?.('Network error occurred');
  };

  // Go back in WebView
  const goBack = () => {
    if (canGoBack && webViewRef.current) {
      webViewRef.current.goBack();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView className="flex-1 bg-white dark:bg-gray-900">
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700">
          <TouchableOpacity onPress={onCancel}>
            <Text className="text-blue-500 dark:text-blue-400 text-lg">Cancel</Text>
          </TouchableOpacity>
          
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Complete Payment
          </Text>
          
          <TouchableOpacity onPress={goBack} disabled={!canGoBack}>
            <Text className={`text-lg ${canGoBack ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400'}`}>
              Back
            </Text>
          </TouchableOpacity>
        </View>

        {/* Loading Indicator */}
        {isLoading && (
          <View className="absolute top-20 left-0 right-0 z-10 items-center">
            <View className="bg-white dark:bg-gray-800 px-4 py-2 rounded-lg shadow-lg">
              <ActivityIndicator size="small" />
              <Text className="text-gray-600 dark:text-gray-400 mt-2">Loading payment...</Text>
            </View>
          </View>
        )}

        {/* WebView */}
        <WebView
          ref={webViewRef}
          source={{ uri: currURL || authorizationUrl }}
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleError}
          onLoadStart={() => setIsLoading(true)}
          onLoadEnd={() => setIsLoading(false)}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          className="flex-1"
        />
      </SafeAreaView>
    </Modal>
  );
};

export default PaystackPaymentModal
