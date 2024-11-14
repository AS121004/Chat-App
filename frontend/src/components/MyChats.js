import React, { useEffect, useState } from "react";
import { Button, Modal, Stack, Toast, ToastContainer } from "react-bootstrap";
import axios from "axios";
import { getSender } from "../config/ChatLogics.js";
import ChatLoading from "./ChatLoading";
import GroupChatModal from "./miscellaneous/GroupChatModal.js";
import { ChatState } from "../context/ChatProvider.js";
import { Plus } from "react-bootstrap-icons";

const MyChats = ({ fetchAgain }) => {
    const [loggedUser, setLoggedUser] = useState();
    const [showToast, setShowToast] = useState(false);

    const { selectedChat, setSelectedChat, user, chats, setChats } = ChatState();
    // console.log('Hiiiiii', chats)
    const fetchChats = async () => {
        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            const { data } = await axios.get("/api/chat", config);
            setChats(data);
        } catch (error) {
            setShowToast(true);
        }
    };

    useEffect(() => {
        setLoggedUser(JSON.parse(localStorage.getItem("userInfo")));
        fetchChats();
    }, [fetchAgain]);

    return (
        <div
            className={`d-${selectedChat ? 'none' : 'flex'} d-md-flex flex-column align-items-center p-3 bg-white`}
            style={{
                // display: selectedChat ? "none" : "flex",
                // display: "flex",
                // flexDirection: "column",
                // alignItems: "center",
                // padding: "16px",
                // backgroundColor: "white",
                marginRight: "4px",
                width: "40%",
                borderRadius: "8px",
                border: "1px solid #e0e0e0",
            }}
        >
            <div
                style={{
                    display: "flex",
                    width: "100%",
                    justifyContent: "space-between",
                    alignItems: "center",
                    paddingBottom: "16px",
                    fontSize: "28px",
                    fontFamily: "Work sans",
                }}
            >
                My Chats
                <GroupChatModal>
                    <Button
                        variant="secondary"
                        style={{
                            display: "flex",
                            fontSize: "17px",
                            alignItems: "center",
                        }}
                    >
                        New Group Chat <Plus size={20} style={{ marginLeft: "8px" }} />
                    </Button>
                </GroupChatModal>
            </div>

            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    backgroundColor: "#F8F8F8",
                    width: "100%",
                    height: "100%",
                    borderRadius: "8px",
                    overflowY: "hidden",
                }}
            >
                {chats ? (
                    <Stack style={{ overflowY: "scroll", maxHeight: "400px" }}>
                        {chats.map((chat) => (
                            <div
                                key={chat._id}
                                onClick={() => setSelectedChat(chat)}
                                style={{
                                    cursor: "pointer",
                                    backgroundColor: selectedChat === chat ? "#38B2AC" : "#E8E8E8",
                                    color: selectedChat === chat ? "white" : "black",
                                    padding: "10px 15px",
                                    borderRadius: "8px",
                                    marginBottom: "10px",
                                }}
                            >
                                <div>{!chat.isGroupChat ? getSender(loggedUser, chat.users) : chat.chatName}</div>
                                {/* {chat.latestMessage && (
                                    <div style={{ fontSize: "12px" }}>
                                        <strong>{chat.latestMessage.sender.name} : </strong>
                                        {chat.latestMessage.content.length > 50
                                            ? chat.latestMessage.content.substring(0, 51) + "..."
                                            : chat.latestMessage.content}
                                    </div>
                                )} */}
                            </div>
                        ))}
                    </Stack>
                ) : (
                    <ChatLoading />
                )}
            </div>

            {showToast && (
                <ToastContainer position="bottom-end">
                    <Toast onClose={() => setShowToast(false)} delay={5000} autohide bg="danger">
                        <Toast.Header>
                            <strong className="me-auto">Error Occurred!</strong>
                        </Toast.Header>
                        <Toast.Body>Failed to load the chats.</Toast.Body>
                    </Toast>
                </ToastContainer>
            )}
        </div>
    );
};

export default MyChats;
