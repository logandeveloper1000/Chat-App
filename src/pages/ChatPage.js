import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import {
  doc, getDoc, updateDoc, collection, addDoc,
  onSnapshot, serverTimestamp, query, orderBy
} from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

export default function ChatPage() {
  const { chatId } = useParams();
  const { currentUser } = useAuth();
  const [chat, setChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const bottomRef = useRef();

  const otherUser = chat?.participants?.find(email => email !== currentUser.email);

  // Fallback way to get other user's ID from presence map
  const otherUserId = chat?.presence
    ? Object.keys(chat.presence).find((uid) => uid !== currentUser.uid)
    : null;

  // Track presence when entering/leaving the chat
  useEffect(() => {
    const chatRef = doc(db, "chats", chatId);
    updateDoc(chatRef, { [`presence.${currentUser.uid}`]: true });

    return () => {
      updateDoc(chatRef, { [`presence.${currentUser.uid}`]: false });
    };
  }, [chatId, currentUser.uid]);

  // Fetch chat and ensure read receipt
  useEffect(() => {
    const fetchChat = async () => {
      const chatDoc = doc(db, "chats", chatId);
      const snapshot = await getDoc(chatDoc);
      if (snapshot.exists()) {
        const data = snapshot.data();
        setChat(data);

        if (!data.lastMessage?.readBy?.includes(currentUser.uid)) {
          await updateDoc(chatDoc, {
            "lastMessage.readBy": [...(data.lastMessage.readBy || []), currentUser.uid]
          });
        }
      }
    };
    fetchChat();
  }, [chatId, currentUser.uid]);

  // Listen to messages in real-time
  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setMessages(msgs);
      setLoading(false);
    });
    return unsub;
  }, [chatId]);

  // Listen to chat document changes (typing + presence)
  useEffect(() => {
    const chatDoc = doc(db, "chats", chatId);
    const unsub = onSnapshot(chatDoc, (snapshot) => {
      if (snapshot.exists()) {
        setChat(snapshot.data());
      }
    });
    return unsub;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInput(val);
    const chatRef = doc(db, "chats", chatId);
    updateDoc(chatRef, { [`typing.${currentUser.uid}`]: val.length > 0 });
  };

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const messagesRef = collection(db, "chats", chatId, "messages");
    const message = {
      text: input,
      senderEmail: currentUser.email,
      senderId: currentUser.uid,
      createdAt: serverTimestamp(),
    };

    await addDoc(messagesRef, message);

    await updateDoc(doc(db, "chats", chatId), {
      lastMessage: {
        ...message,
        readBy: [currentUser.uid],
      },
      updatedAt: serverTimestamp(),
      [`typing.${currentUser.uid}`]: false
    });

    setInput("");
  };

  if (loading) return <Loading />;

  return (
    <>
      <Navbar alerts={[]} clearAlerts={() => {}} />
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="chat-title">
            Chat with {otherUser}
            <span className={chat?.presence?.[otherUserId] ? "status online" : "status offline"}>
              {chat?.presence?.[otherUserId] ? " • Online" : " • Not in chat"}
            </span>
          </h2>
        </div>

        <div className="chat-messages">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={
                "chat-bubble " +
                (msg.senderId === currentUser.uid ? "self" : "other")
              }
            >
              {msg.text}
              <div className="chat-time">
                {msg.createdAt?.toDate().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {chat?.typing &&
          Object.entries(chat.typing).some(
            ([uid, isTyping]) => uid !== currentUser.uid && isTyping
          ) && (
            <div className="typing-indicator">{otherUser} is typing...</div>
          )}

        <form onSubmit={sendMessage} className="chat-form">
          <input
            value={input}
            onChange={handleInputChange}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </>
  );
}
