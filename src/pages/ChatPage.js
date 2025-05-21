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
  const messagesRef = collection(db, "chats", chatId, "messages");

  useEffect(() => {
    const fetchChat = async () => {
      const docRef = doc(db, "chats", chatId);
      const snapshot = await getDoc(docRef);
      if (snapshot.exists()) {
        const chatData = snapshot.data();
        setChat(chatData);

        if (!chatData.lastMessage?.readBy?.includes(currentUser.uid)) {
          await updateDoc(docRef, {
            "lastMessage.readBy": [...(chatData.lastMessage.readBy || []), currentUser.uid],
          });
        }
      }
    };

    fetchChat();
  }, [chatId, currentUser.uid]);

  useEffect(() => {
    const messagesRef = collection(db, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt"));
    const unsub = onSnapshot(q, (snapshot) => {
      const msgs = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setMessages(msgs);
      setLoading(false);
    });

    return () => unsub();
}, [chatId]);


  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

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
    });

    setInput("");
  };

  const otherUser = chat?.participants?.find((email) => email !== currentUser.email);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar alerts={[]} clearAlerts={() => {}} />
      <div className="chat-container">
        <div className="chat-header">
          <h2 className="chat-title">Chat with {otherUser || "..."}</h2>
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
                {msg.createdAt?.toDate().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
              </div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        <form onSubmit={sendMessage} className="chat-form">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type a message..."
            className="chat-input"
          />
          <button type="submit" className="send-button">Send</button>
        </form>
      </div>
    </>
  );
}
