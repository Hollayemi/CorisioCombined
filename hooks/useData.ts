import { useContext } from "react";
import { DataContext }  from "../context/userContext";
import { ChatContext }  from "../context/chatContext";
import { StoreDataContext }  from "../context/storeContext";

export const useUserData = () => useContext(DataContext);
export const useChatData = () => useContext(ChatContext);
export const useStoreData = () => useContext(StoreDataContext);

