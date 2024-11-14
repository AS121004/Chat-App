import { useEffect, useState } from "react";
import { ArrowLeft } from "react-bootstrap-icons";
import axios from "axios";
import io from "socket.io-client";
import ProfileModal from "./miscellaneous/ProfileModal.js";
import ScrollableChat from "./ScrollableChat";
import UpdateGroupChatModal from "./miscellaneous/UpdateGroupChatModal.js";
import { ChatState } from "../context/ChatProvider.js";
import { getSender, getSenderFull } from "../config/ChatLogics.js";
import Lottie from "react-lottie";
import animationData from "../animations/typing.json";
import "./styles.css"

const ENDPOINT = "http://localhost:5000";
let socket, selectedChatCompare;

const SingleChat = ({ fetchAgain, setFetchAgain }) => {
    const [messages, setMessages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newMessage, setNewMessage] = useState("");
    const [socketConnected, setSocketConnected] = useState(false);
    const [typing, setTyping] = useState(false);
    const [istyping, setIsTyping] = useState(false);

    const defaultOptions = {
        loop: true,
        autoplay: true,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const { selectedChat, setSelectedChat, user, notification, setNotification } = ChatState();

    // console.log('SingleChat', fetchAgain, setFetchAgain)
    const fetchMessages = async () => {
        if (!selectedChat) return;

        try {
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };

            setLoading(true);

            const { data } = await axios.get(`/api/message/${selectedChat._id}`, config);
            setMessages(data);
            setLoading(false);

            socket.emit("join chat", selectedChat._id);
        } catch (error) {
            console.error("Failed to load messages:", error);
        }
    };

    const sendMessage = async (event) => {
        if (event.key === "Enter" && newMessage) {
            socket.emit("stop typing", selectedChat._id);
            try {
                const config = {
                    headers: {
                        "Content-type": "application/json",
                        Authorization: `Bearer ${user.token}`,
                    },
                };
                setNewMessage("");
                const { data } = await axios.post(
                    "/api/message",
                    { content: newMessage, chatId: selectedChat },
                    config
                );
                socket.emit("new message", data);
                // console.log(data);


                setMessages([...messages, data]);
            } catch (error) {
                console.error("Failed to send message:", error);
            }
        }
    };

    useEffect(() => {
        socket = io(ENDPOINT);
        socket.emit("setup", user);
        socket.on("connected", () => setSocketConnected(true));
        socket.on("typing", () => setIsTyping(true));
        socket.on("stop typing", () => setIsTyping(false));
    });

    useEffect(() => {
        fetchMessages();
        selectedChatCompare = selectedChat;
    }, [selectedChat]);

    useEffect(() => {
        socket.on("message received", (newMessageReceived) => {
            if (
                !selectedChatCompare ||
                selectedChatCompare._id !== newMessageReceived.chat._id
            ) {
                if (!notification.includes(newMessageReceived)) {
                    setNotification([newMessageReceived, ...notification]);
                    setFetchAgain(!fetchAgain);
                }
            } else {
                setMessages([...messages, newMessageReceived]);
            }
        });
    });

    const typingHandler = (e) => {
        setNewMessage(e.target.value);

        if (!socketConnected) return;

        if (!typing) {
            setTyping(true);
            socket.emit("typing", selectedChat._id);
        }
        let lastTypingTime = new Date().getTime();
        const timerLength = 3000;
        setTimeout(() => {
            const timeNow = new Date().getTime();
            const timeDiff = timeNow - lastTypingTime;
            if (timeDiff >= timerLength && typing) {
                socket.emit("stop typing", selectedChat._id);
                setTyping(false);
            }
        }, timerLength);
    };

    return (
        <>
            {selectedChat ? (
                <>
                    <div className="d-flex justify-content-between align-items-center p-2 w-100 border-bottom">
                        <button className="btn btn-link d-md-none" onClick={() => setSelectedChat("")}>
                            <ArrowLeft size={24} />
                        </button>
                        <h3 className="fs-4 mb-0" style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            width: "100%",

                        }}>
                            {messages &&
                                (!selectedChat.isGroupChat ? (
                                    <>
                                        {getSender(user, selectedChat.users)}
                                        <ProfileModal user={getSenderFull(user, selectedChat.users)} />

                                    </>
                                ) : (
                                    <>
                                        {selectedChat.chatName.toUpperCase()}
                                        <UpdateGroupChatModal
                                            fetchMessages={fetchMessages}
                                            fetchAgain={fetchAgain}
                                            setFetchAgain={setFetchAgain}
                                        />
                                    </>
                                ))}
                        </h3>
                    </div>
                    <div
                        className="d-flex flex-column justify-content-end p-3 bg-light border rounded overflow-auto"
                        style={{ height: "100%", width: "100%" }}
                    >
                        {loading ? (
                            <div className="d-flex justify-content-center align-items-center">
                                <div className="spinner-border" role="status">
                                    <span className="visually-hidden">Loading...</span>
                                </div>
                            </div>
                        ) : (
                            <div className="messages">
                                <ScrollableChat messages={messages} />
                            </div>
                        )}
                        <div className="mt-3">
                            {istyping && (
                                <div>
                                    <Lottie options={defaultOptions}
                                        width={70}
                                        style={{ marginBottom: 15, marginLeft: 0 }}
                                    />
                                </div>
                            )}
                            <input
                                type="text"
                                className="form-control"
                                placeholder="Enter a message..."
                                value={newMessage}
                                onKeyDown={sendMessage}
                                onChange={typingHandler}
                            />
                        </div>
                    </div>
                </>
            ) : (
                <div className="d-flex align-items-center justify-content-center h-100">
                    <h1>Click on a user to start chatting</h1>
                </div>
            )}
        </>
    );
};

export default SingleChat;
