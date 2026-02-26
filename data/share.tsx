import { Share } from "react-native";



const playStoreLink = "https://play.google.com/store/apps/details?id=corisio";
const appStoreLink = "https://apps.apple.com/app/corisio/id123456789";

export const shareToWhatsApp = async (details: any) => {

    const message = `
        Hey 👋,  
        \nI’m using Corisio, a fast way to find stores, products, and services near you. \n
Download the app here:\n🔹 Play Store: ${playStoreLink}\n🔹 App Store: ${appStoreLink}  
            \nUse my referral code **${details.ref_id?.toUpperCase()}** when signing up and enjoy extra benefits 🎉
        `;
    // let url = "whatsapp://send?text=" + encodeURIComponent(message);

    // Linking.openURL(url).catch(() => {
    //     alert("Make sure WhatsApp is installed on your device");
    // });
    await Share.share({
        message: message.trim(),
    });
};

export const shareProduct = async (product: any, store: any) => {
    const productLink = `https://corisio.com/${store.store}/${product.urlKey}`
    const messageTemplates = [
        `Check out ${product.productName ? product.productName : "this amazing product"} I found on Corisio! 🛍️

${productLink}

✨ Discover more great products and deals on the Corisio app:
• Android: ${playStoreLink}
• iOS: ${appStoreLink}

#Corisio #Shopping #Deals`,

        `Hey! Check out ${product.productName || "this product"} on Corisio: ${product}

Get the app:
Android: ${playStoreLink}
iOS: ${appStoreLink}`,

        `🎉 You've got to see ${product.productName ? `"${product.productName}"` : "this"} on Corisio! 

${productLink}

Download Corisio for the best shopping experience:
📱 ${playStoreLink}
📱 ${appStoreLink}`,

        `${product.productName || "Check out this product"}: ${productLink}

Available on Corisio - Download now:
Android: ${playStoreLink}
iOS: ${appStoreLink}`,

        `Have you seen ${product.productName ? product.productName : "this"} on Corisio? 🤔

${productLink}

Find this and more on the Corisio app:
→ Android: ${playStoreLink}
→ iOS: ${appStoreLink}`,

        `🛒 Found something you might like on Corisio!

${product.productName ? `"${product.productName}"` : "This product"}: ${productLink}

Explore amazing deals on the Corisio app:
📲 ${playStoreLink}
📲 ${playStoreLink}`
    ];

    const randomIndex = Math.floor(Math.random() * messageTemplates.length);
    const message = messageTemplates[randomIndex];

    try {
        await Share.share({
            message: message.trim(),
        });

        console.log(`Shared with template ${randomIndex + 1}`);

    } catch (error) {
        console.error('Error sharing product:', error);
    }
};


export const shareStoreOwner = async (store: any) => {
    const storeName = store.businessName;
    const storeUrl = `https://corisio.com/${store.store}-${store.branch}`;
    const playStoreLink = "https://play.google.com/store/apps/details?id=corisio";
    const appStoreLink = "https://apps.apple.com/app/corisio/id123456789";

    const messageTemplates = [
        `🏪 Discover ${storeName} on Corisio!

${storeUrl}

Support this amazing store and explore their products on the Corisio app:
• Android: ${playStoreLink}
• iOS: ${appStoreLink}

#SupportSmallBusiness #Corisio`,

        `🌟 Show some love to ${storeName} on Corisio!

${storeUrl}

Join our community of shoppers and discover unique stores:
📱 Android: ${playStoreLink}
📱 iOS: ${appStoreLink}`,

        `I found this awesome store on Corisio and thought you'd love it too!

🏬 ${storeName}

Check them out: ${storeUrl}

Get the Corisio app to explore more local businesses:
→ Android: ${playStoreLink}
→ iOS: ${appStoreLink}`,

        `🎉 You have to check out ${storeName} on Corisio! Their products are fantastic!

${storeUrl}

Support local businesses through Corisio:
• Android: ${playStoreLink}
• iOS: ${appStoreLink}`,

        `${storeName} - Featured Store on Corisio

${storeUrl}

Available on Corisio Marketplace:
Android: ${playStoreLink}
iOS: ${appStoreLink}`,

        `📖 Discover ${storeName} on Corisio! Their story and products are worth exploring.

${storeUrl}

Download Corisio to support amazing stores:
📲 ${playStoreLink}
📲 ${appStoreLink}`,

        `🛍️ Explore unique products from ${storeName} on Corisio!

${storeUrl}

Find your next favorite item and support local businesses:
• Android: ${playStoreLink}
• iOS: ${appStoreLink}`,

        `✨ Amazing shopping experience awaits at ${storeName} on Corisio!

${storeUrl}

Discover this store and many more on the Corisio app:
📱 ${playStoreLink}
📱 ${appStoreLink}`
];

    // Randomly select a template
    const randomIndex = Math.floor(Math.random() * messageTemplates.length);
    const message = messageTemplates[randomIndex];

    try {
        await Share.share({
            message: message.trim(),
        });

        console.log(`Shared store with template ${randomIndex + 1}`);

    } catch (error) {
        console.error('Error sharing store:', error);
    }
};