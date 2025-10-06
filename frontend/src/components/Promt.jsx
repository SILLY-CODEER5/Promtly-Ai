import React, { useEffect, useRef, useState } from "react";
import { ArrowUp } from "lucide-react";
import logo from "../../public/promptly2.png";
import axios from "axios";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { tomorrow as codeTheme } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useChat } from "../../context/ChatProvider";

function Promt() {
  const [inputValue, setInputValue] = useState("");
  const [loading, setLoading] = useState(false);
  const textareaRef = useRef(null);
  const promtEndRef = useRef();

  const { activeChatId, addMessageToActiveChat, chats } = useChat();
  const activeChat = chats.find((chat) => chat.id === activeChatId);
  const promt = activeChat ? activeChat.messages : [];

  useEffect(() => {
    promtEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [promt, loading]);

  const handleSend = async () => {
    const trimmed = inputValue.trim();
    if (!trimmed || !activeChatId || loading) return; // Prevent sending while loading

    setInputValue("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    addMessageToActiveChat({ role: "user", content: trimmed }, trimmed);

    try {
      const token = localStorage.getItem("token");
      const { data } = await axios.post(
        "http://localhost:4002/api/v1/deepseekai/promt",
        { content: trimmed },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      addMessageToActiveChat({ role: "assistant", content: data.reply });
    } catch (error) {
      addMessageToActiveChat({
        role: "assistant",
        content: "Something went wrong with the AI response.",
      });
    } finally {
      setLoading(false);
    }
  };

  // This function handles both state updates and resizing
  const handleInputChange = (e) => {
    setInputValue(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      // Reset height to 'auto' to get the correct scrollHeight
      textarea.style.height = "auto";
      // Set the height to the scrollHeight to fit the content
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // const handleKeyDown = (e) => {
  //   if (e.key === "Enter") {
  //     e.preventDefault(); // Prevents new line on Enter press
  //     handleSend();
  //   }
  // };

  const handleKeyDown = (e) => {
    // If "Enter" is pressed WITHOUT the "Shift" key, send the message
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault(); // Prevents adding a new line
      handleSend();
    }
    // If "Shift + Enter" is pressed, the default browser behavior will occur
  };

  if (!activeChat) {
    return (
      <div className="flex flex-col items-center justify-center flex-1 w-full px-4 pb-4">
        {/* Greeting when no chat is selected */}
        <div className="mt-16 text-center">
          {/* 👇 ADD THIS IMAGE TAG & REMOVE THE OLD ONE 👇 */}
          <img
            src={logo}
            alt="Promptly Logo"
            className="w-28.5 h-28.5 mx-auto mb-4" // <-- Bigger size
          />
          <h1 className="text-3xl font-semibold text-white mb-2">
            Hi, I'm Promptly
          </h1>
          <p className="text-gray-400 text-base mt-2">
            💬 Click "+ New Chat" in the sidebar to get started!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-between flex-1 w-full px-4 pb-4">
      {promt.length === 0 && !loading && (
        <div className="mt-16 text-center">
          {/* 👇 ADD THIS IMAGE TAG 👇 */}
          <img
            src={logo}
            alt="Promptly Logo"
            className="w-25 h-25 mx-auto mb-4 rounded-full "
          />
          <h1 className="text-3xl font-semibold text-white mb-2">
            Hi, I'm Promptly
          </h1>
          <p className="text-gray-400 text-base mt-2">
            💬 How can I help you today?
          </p>
        </div>
      )}

      {/* Promt / Chat messages */}
      <div className="w-full max-w-4xl flex-1 overflow-y-auto mt-6 mb-4 space-y-4 max-h-[70vh] px-1">
        {promt.map((msg, index) => (
          <div
            key={index}
            className={`w-full flex ${
              msg.role === "user" ? "justify-end" : "justify-start"
            }`}
          >
            {msg.role === "assistant" ? (
              <div className="w-auto max-w-[90%] bg-[#232323] text-white rounded-xl px-4 py-3 text-sm whitespace-pre-wrap">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={{
                    code({ node, inline, className, children, ...props }) {
                      const match = /language-(\w+)/.exec(className || "");
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={codeTheme}
                          language={match[1]}
                          PreTag="div"
                          className="rounded-lg mt-2"
                          {...props}
                        >
                          {String(children).replace(/\n$/, "")}
                        </SyntaxHighlighter>
                      ) : (
                        <code
                          className="bg-gray-800 px-1 py-0.5 rounded"
                          {...props}
                        >
                          {children}
                        </code>
                      );
                    },
                  }}
                >
                  {msg.content}
                </ReactMarkdown>
              </div>
            ) : (
              <div className="w-auto max-w-[75%] bg-blue-700 text-white rounded-xl px-4 py-2 text-sm whitespace-pre-wrap">
                {msg.content}
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex justify-start w-full">
            <div className="bg-[#232323] text-white px-4 py-2 rounded-xl text-sm animate-pulse">
              Loading...
            </div>
          </div>
        )}

        <div ref={promtEndRef} />
      </div>

      {/* --- MODIFIED INPUT BOX ---
      <div className="w-full max-w-4xl relative mt-auto">
        <div className="bg-[#2f2f2f] rounded-full px-4 py-2 shadow-md flex items-center gap-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="💬 Message Promptly"
            className="bg-transparent flex-1 text-white placeholder-gray-400 text-lg outline-none pl-2"
          />
          <button
            onClick={handleSend}
            disabled={loading || !inputValue.trim()}
            className="bg-gray-500 hover:bg-blue-900 p-2 rounded-full text-white transition disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div> */}

      {/* MODIFIED INPUT BOX */}
      <div className="w-full max-w-4xl relative mt-auto">
        <div className="bg-[#2f2f2f] rounded-2xl px-4 py-3 shadow-md flex items-end gap-3">
          {/* Use a textarea instead of an input */}
          <textarea
            ref={textareaRef}
            value={inputValue}
            onChange={handleInputChange} // We will create this function
            onKeyDown={handleKeyDown}
            placeholder="💬 Message Promptly"
            rows={1} // Start with a single row
            className="bg-transparent flex-1 text-white placeholder-gray-400 text-lg outline-none resize-none overflow-y-auto"
            style={{ maxHeight: "200px" }} // Optional: set a max height
          />
          <button
            onClick={handleSend}
            disabled={loading || !inputValue.trim()}
            className="bg-gray-500 hover:bg-blue-900 p-2 rounded-full text-white transition disabled:bg-gray-700 disabled:cursor-not-allowed"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}

export default Promt;
