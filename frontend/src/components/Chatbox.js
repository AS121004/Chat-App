import { useContext } from "react";
import SingleChat from "./SingleChat";
import { ChatState } from "../context/ChatProvider.js";

const Chatbox = ({ fetchAgain, setFetchAgain }) => {
    const { selectedChat } = ChatState();

    return (
        <div
            className={`d-${selectedChat ? "flex" : "none"} d-md-flex flex-column align-items-center`}
            style={{
                padding: "1rem",
                backgroundColor: "white",
                width: selectedChat ? "100%" : "68%",
                borderRadius: "0.5rem",
                border: "1px solid #ccc",
            }}
        >
            <SingleChat fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
        </div>
    );
};

export default Chatbox;
