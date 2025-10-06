import React,{ useState} from "react";
import { LogOut, X, MoreVertical } from "lucide-react";
import profile from "../../public/user.png";
import { useAuth } from "../../context/AuthProvider";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useChat } from "../../context/ChatProvider";

function Sidebar({ toggleSidebar }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const [menuOpenFor, setMenuOpenFor] = useState(null);

  const [, setAuthUser] = useAuth();
  const navigate = useNavigate();

  const { chats, startNewChat, selectChat, activeChatId, deleteChat } = useChat();

  const handleLogout = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4002/api/v1/user/logout",
        {
          withCredentials: true,
        }
      );

      // localStorage.removeItem(`chatHistory_${user._id}`);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      alert(data.message);

      setAuthUser(null);
      navigate("/login");
    } catch (error) {
      alert(error?.response?.data?.errors || "Logout Failed");
    }
  };
  return (
    <div className="h-full flex flex-col bg-[#232327]">
      {/* Header */}
      <div className="p-4 border-b border-gray-700 flex items-center justify-between">
        <div className="text-xl font-bold text-white">Promptly</div>
        <button onClick={toggleSidebar} className="text-gray-300 w-6 h-6">
          <X />
        </button>
      </div>

      {/* History
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <button
          onClick={startNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4"
        >
          + New Chat
        </button>
        <div className="flex flex-col gap-2">
          {chats && chats.length > 0 ? (
            chats.map((chat) => (
              <button
                key={chat.id}
                onClick={() => selectChat(chat.id)}
                className={`w-full text-left text-sm px-4 py-2 rounded-lg truncate ${
                  chat.id === activeChatId
                    ? "bg-gray-700 text-white" // Style for active chat
                    : "text-gray-400 hover:bg-gray-800"
                }`}
              >
                {chat.title}
              </button>
            ))
          ) : (
            <div className="text-gray-500 text-sm mt-20 text-center">
              No chat history yet
            </div>
          )}
        </div>
      </div> */}
      {/* History */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-2">
        <button
          onClick={startNewChat}
          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl mb-4"
        >
          + New Chat
        </button>
        <div className="flex flex-col gap-2">
          {chats && chats.length > 0 ? (
            chats.map((chat) => (
              // 👇 WRAPPER DIV TO POSITION THE MENU
              <div key={chat.id} className="relative w-full group">
                <button
                  onClick={() => selectChat(chat.id)}
                  className={`w-full text-left text-sm pl-4 pr-10 py-2 rounded-lg truncate ${
                    chat.id === activeChatId
                      ? "bg-gray-700 text-white" // Style for active chat
                      : "text-gray-400 hover:bg-gray-800"
                  }`}
                >
                  {chat.title}
                </button>

                {/* 👇 THREE DOTS MENU BUTTON */}
                <button
                  onClick={() =>
                    setMenuOpenFor(menuOpenFor === chat.id ? null : chat.id)
                  }
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-gray-400 rounded-md hover:bg-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical size={18} />
                </button>

                {/* 👇 DELETE MENU POPUP */}
                {menuOpenFor === chat.id && (
                  <div className="absolute right-0 mt-1 w-32 bg-[#333337] rounded-md shadow-lg z-10">
                    <button
                      onClick={() => deleteChat(chat.id)}
                      className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 rounded-md"
                    >
                      Delete
                    </button>
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-gray-500 text-sm mt-20 text-center">
              No chat history yet
            </div>
          )}
        </div>
      </div>
      {/* Footer */}
      <div className="p-4 border-t border-gray-700">
        <div className="flex flex-col gap-3">
          <div className="flex items-center gap-2 cursor-pointer">
            <img className="rounded-full w-8 h-8 " src={profile} alt="" />
            <span className="text-gray-300">
              {user ? user.firstName : "My Profile"}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm text-white px-4 py-4 rounded-lg hover:bg-gray-700 duration-300 transition"
          >
            <LogOut className="" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
