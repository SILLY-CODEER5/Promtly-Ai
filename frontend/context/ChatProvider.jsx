import React, { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "./AuthProvider";
import { v4 as uuidv4 } from "uuid";

// 1. Create the context
const ChatContext = createContext();

// 2. Create the provider component
export const ChatProvider = ({ children }) => {
  const { authUser } = useAuth(); // Destructure authUser directly
  const [chats, setChats] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);

  // Effect to load chats from localStorage
  useEffect(() => {
    if (authUser) {
      const userString = localStorage.getItem("user");
      // 👇 FIX: Check if userString exists before parsing and using it
      if (userString) {
        const user = JSON.parse(userString);
        const storedChats = localStorage.getItem(`chatHistory_${user._id}`);
        if (storedChats) {
          setChats(JSON.parse(storedChats));
        } else {
          setChats([]);
        }
      } else {
        // If no user in localStorage, ensure chats are cleared
        setChats([]);
      }
      setActiveChatId(null);
    }
  }, [authUser]);

  // Effect to save chats to localStorage
  useEffect(() => {
    if (authUser) {
      const userString = localStorage.getItem("user");
      // 👇 FIX: Also check here before trying to save
      if (userString) {
        const user = JSON.parse(userString);
        if (chats.length > 0) {
          localStorage.setItem(`chatHistory_${user._id}`, JSON.stringify(chats));
        } else {
          // If no chats left, remove the item
          localStorage.removeItem(`chatHistory_${user._id}`);
        }
      }
    }
  }, [chats, authUser]);

  // Function to start a new chat
  const startNewChat = () => {
    const newChat = {
      id: uuidv4(),
      title: "New Chat",
      messages: [],
      timestamp: Date.now(),
    };
    setChats((prevChats) => [newChat, ...prevChats]);
    setActiveChatId(newChat.id);
  };

  // Function to select an existing chat
  const selectChat = (chatId) => {
    setActiveChatId(chatId);
  };

  // Function to add a message to the active chat
  const addMessageToActiveChat = (message, title = null) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat.id === activeChatId) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, message],
          };
          if (title && chat.title === "New Chat") {
            updatedChat.title = title;
          }
          return updatedChat;
        }
        return chat;
      })
    );
  };

  // Function to delete a chat
  const deleteChat = (chatIdToDelete) => {
    setChats((prevChats) =>
      prevChats.filter((chat) => chat.id !== chatIdToDelete)
    );

    if (activeChatId === chatIdToDelete) {
      setActiveChatId(null);
    }
  };

  const value = {
    chats,
    activeChatId,
    startNewChat,
    selectChat,
    addMessageToActiveChat,
    deleteChat,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

// 3. Create a custom hook for easy access
export const useChat = () => useContext(ChatContext);