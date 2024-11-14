import { useState } from "react";
import axios from "axios";
import { Modal, Button, Form, InputGroup, Badge, Spinner, Toast, ToastContainer } from "react-bootstrap";
import { ChatState } from "../../context/ChatProvider";
import UserBadgeItem from "../UserAvatar/UserBadgeItem";
import UserListItem from "../UserAvatar/UserListItem";
import { FaEye } from "react-icons/fa";

const UpdateGroupChatModal = ({ fetchMessages, fetchAgain, setFetchAgain }) => {
    const [show, setShow] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);
    const [renameloading, setRenameLoading] = useState(false);
    const [toastMessage, setToastMessage] = useState("");

    const { selectedChat, setSelectedChat, user } = ChatState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    // console.log('UpdateGroupChatModal', fetchAgain, setFetchAgain)

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.get(`/api/user?search=${query}`, config);
            setLoading(false);
            setSearchResult(data);
        } catch (error) {
            setToastMessage("Failed to load the search results");
            setLoading(false);
        }
    };

    const handleRename = async () => {
        if (!groupChatName) return;

        try {
            setRenameLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/rename`,
                {
                    chatId: selectedChat._id,
                    chatName: groupChatName,
                },
                config
            );
            // console.log(data);
            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setRenameLoading(false);
            // setGroupChatName("");
        } catch (error) {
            console.log(error);
            setToastMessage("Error occurred while renaming");
            setRenameLoading(false);
        }
        setGroupChatName("");
    };

    const handleAddUser = async (user1) => {
        if (selectedChat.users.find((u) => u._id === user1._id)) {
            setToastMessage("User is already in the group!");
            return;
        }

        if (selectedChat.groupAdmin._id !== user._id) {
            setToastMessage("Only admins can add someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupadd`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            setLoading(false);
        } catch (error) {
            setToastMessage("Error occurred while adding user");
            setLoading(false);
        }
        setGroupChatName("");
    };

    const handleRemove = async (user1) => {
        if (selectedChat.groupAdmin._id !== user._id && user1._id !== user._id) {
            setToastMessage("Only admins can remove someone!");
            return;
        }

        try {
            setLoading(true);
            const config = {
                headers: {
                    Authorization: `Bearer ${user.token}`,
                },
            };
            const { data } = await axios.put(
                `/api/chat/groupremove`,
                {
                    chatId: selectedChat._id,
                    userId: user1._id,
                },
                config
            );

            user1._id === user._id ? setSelectedChat(null) : setSelectedChat(data);
            setFetchAgain(!fetchAgain);
            fetchMessages();
            setLoading(false);
        } catch (error) {
            // console.log(error);
            setToastMessage("Error occurred while removing user");
            setLoading(false);
        }
        setGroupChatName("");
    };

    return (
        <>
            <Button variant="light" onClick={handleShow}>
                <FaEye />
            </Button>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>{selectedChat.chatName}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div className="d-flex flex-wrap mb-3">
                        {selectedChat.users.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                admin={selectedChat.groupAdmin}
                                handleFunction={() => handleRemove(u)}
                            />
                        ))}
                    </div>
                    <InputGroup className="mb-3">
                        <Form.Control
                            placeholder="Chat Name"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                        <Button variant="outline-primary" onClick={handleRename} disabled={renameloading}>
                            {renameloading ? <Spinner animation="border" size="sm" /> : "Update"}
                        </Button>
                    </InputGroup>
                    <Form.Control
                        placeholder="Add User to group"
                        onChange={(e) => handleSearch(e.target.value)}
                        className="mb-3"
                    />
                    {loading ? (
                        <Spinner animation="border" role="status" className="d-block mx-auto" />
                    ) : (
                        searchResult.map((user) => (
                            <UserListItem key={user._id} user={user} handleFunction={() => handleAddUser(user)} />
                        ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="danger" onClick={() => handleRemove(user)}>
                        Leave Group
                    </Button>
                </Modal.Footer>
            </Modal>

            <ToastContainer position="top-end" className="p-3">
                {toastMessage && (
                    <Toast onClose={() => setToastMessage("")} show={!!toastMessage} delay={3000} autohide>
                        <Toast.Body>{toastMessage}</Toast.Body>
                    </Toast>
                )}
            </ToastContainer>
        </>
    );
};

export default UpdateGroupChatModal;
