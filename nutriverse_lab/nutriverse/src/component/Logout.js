import React from 'react'
import { CometChatUIKit } from "@cometchat/chat-uikit-react"; //import uikit package


const Logout = ({sid}) => {

    CometChatUIKit.logout();
    return (
        <div>{sid}</div>
    )
};

export default Logout;
