import { ChatState } from "../context/ChatProvider.js";
import 'bootstrap/dist/css/bootstrap.min.css';
import SideDrawer from "../components/miscellaneous/SideDrawer.js";
import MyChats from "../components/MyChats.js";
import Chatbox from "../components/Chatbox.js";
import { useState } from "react";

const ChatPage = () => {
    const { user } = ChatState()
    const [fetchAgain, setFetchAgain] = useState(false);
    // console.log(user)
    // console.log('ChatPage', fetchAgain, setFetchAgain);
    return (
        <div style={{ width: "100%" }}>
            {user && <SideDrawer />}

            <div className="d-flex justify-content-between w-100" style={{ height: "91.5vh", padding: "10px" }}>
                {user && <MyChats fetchAgain={fetchAgain} />}
                {user && <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />}
            </div>

        </div>
    )
};

export default ChatPage;

