import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import { Spinner, Button, InputGroup, FormControl, Modal, Dropdown, Tooltip, Badge } from "react-bootstrap";
import { FaBell, FaSearch } from "react-icons/fa";
import ProfileModal from "./ProfileModal.js";
import ChatLoading from "../ChatLoading.js";
import UserListItem from "../UserAvatar/UserListItem.js";
import { getSender } from "../../config/ChatLogics";
import { ChatState } from "../../context/ChatProvider.js";
import NotificationBadge from "react-notification-badge";
import { Effect } from "react-notification-badge";



function SideDrawer() {
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [loadingChat, setLoadingChat] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const { setSelectedChat, user, notification, setNotification, chats, setChats } = ChatState();
    // const { user} = ChatState();
    const history = useHistory();

    const logoutHandler = () => {
        localStorage.removeItem("userInfo");
        history.push("/");
    };

    const handleSearch = async () => {
        if (!search) {
            alert("Please enter something in search");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: { Authorization: `Bearer ${user.token}` },
            };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            alert("Error loading search results");
            setLoading(false);
        }
    };

    const accessChat = async (userId) => {
        try {
            setLoadingChat(true);
            const config = {
                headers: {
                    "Content-type": "application/json",
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.post(`/api/chat`, { userId }, config);
            if (!chats.find((c) => c._id === data._id)) setChats([data, ...chats]);
            setSelectedChat(data);
            setLoadingChat(false);
            setShowModal(false);
        } catch (error) {
            alert("Error fetching the chat");
            setLoadingChat(false);
        }
    };




    return (
        <>
            <div className="d-flex justify-content-between align-items-center bg-white w-100 p-3 border-bottom">
                {/* <Tooltip title="Search Users to chat"> */}
                <Button variant="contained" style={{ display: "flex", alignItems: "center" }} onClick={() => setShowModal(true)}>
                    {/* <FaSearch /> */}
                    <div style={{ width: "30px", height: "30px" }}>
                        <svg xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 512 512"
                            style={{ width: "100%", height: "100%" }}
                        >
                            <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z" /></svg>
                    </div>


                    <span className="ms-2">Search User</span>
                </Button>
                {/* </Tooltip> */}

                <h2 className="m-0" style={{ fontFamily: "Work Sans" }}>Chat-App</h2>

                <div className="d-flex align-items-center">
                    <Dropdown>
                        <Dropdown.Toggle variant="light" id="notification-dropdown" style={{ marginRight: "2px" }}>
                            <NotificationBadge
                                count={notification.length}
                                effect={Effect.SCALE}
                            />
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M224 0c-17.7 0-32 14.3-32 32l0 19.2C119 66 64 130.6 64 208l0 18.8c0 47-17.3 92.4-48.5 127.6l-7.4 8.3c-8.4 9.4-10.4 22.9-5.3 34.4S19.4 416 32 416l384 0c12.6 0 24-7.4 29.2-18.9s3.1-25-5.3-34.4l-7.4-8.3C401.3 319.2 384 273.9 384 226.8l0-18.8c0-77.4-55-142-128-156.8L256 32c0-17.7-14.3-32-32-32zm45.3 493.3c12-12 18.7-28.3 18.7-45.3l-64 0-64 0c0 17 6.7 33.3 18.7 45.3s28.3 18.7 45.3 18.7s33.3-6.7 45.3-18.7z" /></svg>
                        </Dropdown.Toggle>

                        <Dropdown.Menu className="p-2">
                            {!notification.length && (
                                <div className="text-center text-muted">No New Messages</div>
                            )}
                            {notification.map((notif) => (
                                <Dropdown.Item
                                    key={notif._id}
                                    onClick={() => {
                                        setSelectedChat(notif.chat);
                                        setNotification(notification.filter((n) => n !== notif));
                                    }}
                                >
                                    {notif.chat.isGroupChat
                                        ? `New Message in ${notif.chat.chatName}`
                                        : `New Message from ${getSender(user, notif.chat.users)}`}
                                </Dropdown.Item>
                            ))}
                        </Dropdown.Menu>
                    </Dropdown>

                    <Dropdown>
                        <Dropdown.Toggle variant="light">
                            <img
                                src={user.pic}
                                alt={user.name}
                                className="rounded-circle"
                                style={{ width: "30px", height: "30px" }}
                            />
                        </Dropdown.Toggle>

                        <Dropdown.Menu>
                            <ProfileModal
                                user={user}
                            >
                                <Dropdown.Item>My Profile</Dropdown.Item>
                            </ProfileModal>
                            <Dropdown.Divider />
                            <Dropdown.Item
                                onClick={logoutHandler}
                            >Logout</Dropdown.Item>
                        </Dropdown.Menu>
                    </Dropdown>
                </div>
            </div>

            <Modal show={showModal} onHide={() => setShowModal(false)}>
                <Modal.Header closeButton>
                    <Modal.Title>Search Users</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <InputGroup className="mb-3">
                        <FormControl
                            placeholder="Search by name or email"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                        <Button variant="primary"
                            onClick={handleSearch}
                        >Go</Button>
                    </InputGroup>

                    {loading ? (
                        <ChatLoading />
                    ) : (
                        searchResult.map((user) => (
                            <UserListItem
                                key={user._id}
                                user={user}
                                handleFunction={() => accessChat(user._id)}
                            />
                        ))
                    )}
                    {loadingChat && <Spinner animation="border" className="d-block mx-auto" />}
                </Modal.Body>
            </Modal>
        </>
    );
}

export default SideDrawer;
