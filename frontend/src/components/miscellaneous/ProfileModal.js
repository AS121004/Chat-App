import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { Eye } from "react-bootstrap-icons"; // Bootstrap icon for view

const ProfileModal = ({ user, children }) => {
    const [show, setShow] = useState(false);

    const handleShow = () => setShow(true);
    const handleClose = () => setShow(false);

    return (
        <>
            {children ? (
                <span onClick={handleShow} style={{ cursor: "pointer" }}>
                    {children}
                </span>
            ) : (
                <Button variant="link" onClick={handleShow}>
                    <Eye size={24} />
                </Button>
            )}

            <Modal show={show} onHide={handleClose} centered size="lg">
                <Modal.Header closeButton>
                    <Modal.Title className="text-center w-100" style={{ fontSize: "40px", fontFamily: "Work sans" }}>
                        {user.name}
                    </Modal.Title>
                </Modal.Header>

                <Modal.Body className="text-center">
                    <img
                        src={user.pic}
                        alt={user.name}
                        className="rounded-circle"
                        style={{ width: "150px", height: "150px" }}
                    />
                    <p style={{ fontSize: "28px", fontFamily: "Work sans", marginTop: "20px" }}>
                        Email: {user.email}
                    </p>
                </Modal.Body>

                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
};

export default ProfileModal;
