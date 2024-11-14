import ScrollableFeed from "react-scrollable-feed";
import {
    isLastMessage,
    isSameSender,
    isSameSenderMargin,
    isSameUser,
} from "../config/ChatLogics";
import { ChatState } from "../context/ChatProvider.js";

const ScrollableChat = ({ messages }) => {
    const { user } = ChatState();

    return (
        <ScrollableFeed>
            {messages &&
                messages.map((m, i) => (
                    <div className="d-flex align-items-start" key={m._id}>
                        {(isSameSender(messages, m, i, user._id) ||
                            isLastMessage(messages, i, user._id)) && (
                                <div className="me-2" data-bs-toggle="tooltip" title={m.sender.name}>
                                    <img
                                        src={m.sender.pic}
                                        alt={m.sender.name}
                                        className="rounded-circle"
                                        style={{ width: "30px", height: "30px", marginTop: "7px", cursor: "pointer" }}
                                    />
                                </div>
                            )}
                        <span
                            className={`p-2 ${m.sender._id === user._id ? "bg-info" : "bg-success"} text-white rounded`}
                            style={{
                                marginLeft: isSameSenderMargin(messages, m, i, user._id),
                                marginTop: isSameUser(messages, m, i, user._id) ? "3px" : "10px",
                                borderRadius: "20px",
                                maxWidth: "75%",
                            }}
                        >
                            {m.content}
                        </span>
                    </div>
                ))}
        </ScrollableFeed>
    );
};

export default ScrollableChat;
