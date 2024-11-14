import React from "react";

const UserListItem = ({ handleFunction, user }) => {
    return (
        <div
            onClick={handleFunction}
            style={{
                cursor: "pointer",
                backgroundColor: "#E8E8E8",
                padding: "10px 15px",
                marginBottom: "10px",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
            }}
            className="user-list-item"
        >
            <img
                src={user.pic}
                alt={user.name}
                style={{
                    width: "40px",
                    height: "40px",
                    borderRadius: "50%",
                    marginRight: "10px",
                }}
                className="avatar"
            />
            <div>
                <div style={{ fontWeight: "bold" }}>{user.name}</div>
                <div style={{ fontSize: "12px" }}>
                    <b>Email:</b> {user.email}
                </div>
            </div>

            <style>
                {`
          .user-list-item:hover {
            background-color: #38B2AC;
            color: white;
          }
        `}
            </style>
        </div>
    );
};

export default UserListItem;
