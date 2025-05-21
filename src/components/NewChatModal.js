import React, { useState } from "react";
import { db } from "../firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuth } from "../context/AuthContext";

export default function NewChatModal({ closeModal }) {
  const [email, setEmail] = useState("");
  const { currentUser } = useAuth();

  const handleStart = async () => {
    if (!email || email === currentUser.email) return;

    const chat = {
      participants: [currentUser.email, email],
      lastMessage: {},
      updatedAt: serverTimestamp(),
    };

    await addDoc(collection(db, "chats"), chat);
    closeModal();
  };

  return (
    <div className="newchat-overlay">
      <div className="newchat-modal">
        <h3>Add a user's email to chat with</h3>
        <input
          type="email"
          placeholder="Enter email..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="newchat-input"
        />
        <div className="newchat-actions">
          <button onClick={closeModal} className="newchat-btn cancel">Cancel</button>
          <button onClick={handleStart} className="newchat-btn start">Start Chat</button>
        </div>
      </div>
    </div>
  );
}
