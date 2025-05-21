import React from "react";

export default function AlertDropdown({ alerts, clearAlerts, onAlertClick }) {
  return (
    <div
      className="alert-dropdown"
      onClick={(e) => e.stopPropagation()} // prevent outside closing
    >
      <div className="alert-header">
        Alerts
        <button onClick={clearAlerts} className="alert-clear">Clear</button>
      </div>
      {alerts.length === 0 ? (
        <div className="alert-empty">No new messages</div>
      ) : (
        alerts.map((alert, idx) => (
          <div
            key={idx}
            className="alert-item"
            onClick={() => onAlertClick(alert.chatId)}
            >
            <strong>{alert.sender}</strong> sent a message!
        </div>

        ))
      )}
    </div>
  );
}
