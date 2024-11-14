import { X } from "react-bootstrap-icons"; // Import an icon library
import { Badge } from "react-bootstrap"; // Bootstrap Badge component

const UserBadgeItem = ({ user, handleFunction, admin }) => {
    return (
        <Badge
            pill
            bg="primary"
            text="light"
            className="m-1 p-2"
            style={{ cursor: "pointer" }}
            onClick={handleFunction}
        >
            {user.name}
            {admin === user._id && <span> (Admin)</span>}
            <X className="ms-2" />
        </Badge>
    );
};

export default UserBadgeItem;
