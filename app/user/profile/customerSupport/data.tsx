import {
  AntDesign,
  Feather,
  FontAwesome5,
  Ionicons,
  MaterialCommunityIcons,
  MaterialIcons,
  Octicons,
} from "@expo/vector-icons";

const typeData = [
  {
    id: "1",
    title: `Login and ${"\n"} Account`,
    Icon: (
      <MaterialCommunityIcons name="lock-outline" size={23} className="text-[#2A347E] dark:!text-[#eee]" />
    ),
  },
  {
    id: "2",
    title: `Order and ${"\n"} Transaction Inquiries`,
    Icon: <Feather name="box" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
  {
    id: "3",
    title: `Product  ${"\n"} and Service`,
    Icon: <AntDesign name="isv" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
  {
    id: "4",
    title: `Shipping ${"\n"} and Delivery`,
    Icon: <FontAwesome5 name="shipping-fast" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
  {
    id: "5",
    title: `Returns and ${"\n"} Exchanges`,
    Icon: <FontAwesome5 name="exchange-alt" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
  {
    id: "6",
    title: `Billing and ${"\n"} Payments`,
    Icon: <MaterialIcons name="payment" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
  {
    id: "7",
    title: `Feedback and ${"\n"} Suggestions`,
    Icon: (
      <MaterialCommunityIcons
        name="comment-question-outline"
        size={23}
        className="text-[#2A347E] dark:!text-[#eee]"
      />
    ),
  },
  {
    id: "8",
    title: `Promotions and ${"\n"} Discounts`,
    Icon: <Feather name="settings" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
  {
    id: "9",
    title: `Account  ${"\n"} Management`,
    Icon: (
      <MaterialCommunityIcons
        name="shield-account-outline"
        size={23}
        className="text-[#2A347E] dark:!text-[#eee]"
      />
    ),
  },
  {
    id: "10",
    title: `General ${"\n"} Assistance`,
    Icon: (
      <MaterialCommunityIcons
        name="help-network-outline"
        size={23}
        className="text-[#2A347E] dark:!text-[#eee]"
      />
    ),
  },
];

export default typeData

export const optionData = [
  {
    id: "1",
    title: "Security Centre",
    Icon: <Octicons name="shield-lock" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
    desc: "Tap to report a scam, user or store, or restrict your account.",
  },
  {
    id: "2",
    title: `Live Chat`,
    Icon: <Ionicons name="chatbubbles-outline" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
    desc: "Connect with our customer care agent and lay your comment, Available 24/7.",
  },
  {
    id: "3",
    title: `Contact us via Mail`,
    Icon: <Ionicons name="mail-unread-outline" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
  {
    id: "4",
    title: `Contact via Call Support`,
    Icon: <Feather name="phone-call" size={23} className="text-[#2A347E] dark:!text-[#eee]" />,
  },
];
