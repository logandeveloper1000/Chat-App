import React, { useEffect, useState } from "react";
import { collection, query, where, orderBy, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { useAuth } from "../context/AuthContext";
import ChatCard from "../components/ChatCard";
import NewChatModal from "../components/NewChatModal";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";
import Loading from "../components/Loading";

export default function Dashboard() {
  const { currentUser } = useAuth();
  const [chats, setChats] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const q = query(
      collection(db, "chats"),
      where("participants", "array-contains", currentUser.email),
      orderBy("updatedAt", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const chatList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        unread: doc.data().lastMessage?.readBy?.includes(currentUser.uid) === false,
      }));

      const newAlerts = chatList
        .filter((chat) => chat.unread)
        .map((chat) => ({
          sender: chat.lastMessage?.senderEmail,
          chatId: chat.id,
        }));

      setChats(chatList);
      setAlerts(newAlerts);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) return <Loading />;

  return (
    <>
      <Navbar alerts={alerts} clearAlerts={() => setAlerts([])} />
      <div className="dashboard-container">
        <div className="dashboard-header">
          <button onClick={() => setShowModal(true)} className="dashboard-newchat-btn">
            New Chat
          </button>
        </div>

        <div className="dashboard-cards">
          {chats.map((chat) => (
            <ChatCard
              key={chat.id}
              chat={chat}
              currentUser={currentUser}
              onClick={() => navigate(`/chat/${chat.id}`)}
            />
          ))}
        </div>

        {showModal && <NewChatModal closeModal={() => setShowModal(false)} />}
      </div>
    </>
  );
}
