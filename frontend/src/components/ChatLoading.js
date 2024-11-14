import React from "react";

const ChatLoading = () => {
    return (
        <div className="d-flex flex-column gap-2">
            {[...Array(12)].map((_, index) => (
                <div
                    key={index}
                    className="skeleton"
                    style={{
                        height: "45px",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "4px",
                        animation: "pulse 1.5s infinite",
                    }}
                ></div>
            ))}
            <style>
                {`
          @keyframes pulse {
            0% {
              opacity: 1;
            }
            50% {
              opacity: 0.5;
            }
            100% {
              opacity: 1;
            }
          }
        `}
            </style>
        </div>
    );
};

export default ChatLoading;
