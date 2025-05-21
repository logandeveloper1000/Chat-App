import React from "react";

export default function ChatCard({ chat, currentUser, onClick }) {
  const otherUser = chat.participants.find((email) => email !== currentUser.email);
  const lastMsg = chat.lastMessage?.text || "No messages yet";
  const lastSender = chat.lastMessage?.senderEmail || "";

  return (
    <div onClick={onClick} className="dashboard-card">
      <div className="dashboard-card-header">
        <h4 className="dashboard-card-title">{otherUser}</h4>
        {chat.unread && <span className="dashboard-card-dot"></span>}
      </div>
      <p className="dashboard-card-desc">
        <strong>{lastSender === currentUser.email ? "You" : lastSender}:</strong> {lastMsg}
      </p>
    </div>
  );
}
