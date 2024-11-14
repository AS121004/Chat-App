import { useState } from "react";
import axios from "axios";
import { Modal, Button, Form, Spinner } from "react-bootstrap";
import { ChatState } from "../../context/ChatProvider.js";
import UserBadgeItem from "../UserAvatar/UserBadgeItem.js";
import UserListItem from "../UserAvatar/UserListItem.js";

const GroupChatModal = ({ children }) => {
    const [show, setShow] = useState(false);
    const [groupChatName, setGroupChatName] = useState("");
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [search, setSearch] = useState("");
    const [searchResult, setSearchResult] = useState([]);
    const [loading, setLoading] = useState(false);

    const { user, chats, setChats } = ChatState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleGroup = (userToAdd) => {
        if (selectedUsers.includes(userToAdd)) {
            alert("User already added");
            return;
        }
        setSelectedUsers([...selectedUsers, userToAdd]);
    };

    const handleSearch = async (query) => {
        setSearch(query);
        if (!query) return;

        try {
            setLoading(true);
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.get(`/api/user?search=${search}`, config);
            setSearchResult(data);
            setLoading(false);
        } catch (error) {
            alert("Failed to Load the Search Results");
        }
    };

    const handleDelete = (delUser) => {
        setSelectedUsers(selectedUsers.filter((sel) => sel._id !== delUser._id));
    };

    const handleSubmit = async () => {
        if (!groupChatName || !selectedUsers.length) {
            alert("Please fill all the fields");
            return;
        }

        try {
            const config = { headers: { Authorization: `Bearer ${user.token}` } };
            const { data } = await axios.post(
                `/api/chat/group`,
                {
                    name: groupChatName,
                    users: JSON.stringify(selectedUsers.map((u) => u._id)),
                },
                config
            );
            setChats([data, ...chats]);
            handleClose();
            alert("New Group Chat Created!");

        } catch (error) {
            alert("Failed to Create the Chat!");
        }
    };

    return (
        <>
            <span onClick={handleShow}>{children}</span>

            <Modal show={show} onHide={handleClose} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Create Group Chat</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Chat Name"
                            value={groupChatName}
                            onChange={(e) => setGroupChatName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group className="mb-3">
                        <Form.Control
                            type="text"
                            placeholder="Add Users e.g., John, Anshul, Jane"
                            value={search}
                            onChange={(e) => handleSearch(e.target.value)}
                        />
                    </Form.Group>
                    <div className="d-flex flex-wrap mb-3">
                        {selectedUsers.map((u) => (
                            <UserBadgeItem
                                key={u._id}
                                user={u}
                                handleFunction={() => handleDelete(u)}
                            />
                        ))}
                    </div>
                    {loading ? (
                        <Spinner animation="border" role="status">
                            <span className="visually-hidden">Loading...</span>
                        </Spinner>
                    ) : (
                        searchResult
                            ?.slice(0, 4)
                            .map((user) => (
                                <UserListItem
                                    key={user._id}
                                    user={user}
                                    handleFunction={() => handleGroup(user)}
                                />
                            ))
                    )}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="primary" onClick={handleSubmit}>
                        Create Chat
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default GroupChatModal;
