import icon from '../assets/chat_icon.png'
import '../pages/css/Chat.css'
import { CometChat } from "@cometchat/chat-sdk-javascript";
import ChatList from './chat_list';
import { useEffect, useState } from 'react';





const ChatSearchbar = (props)=>{

    const [search, setSearch] = useState('');
    
    useEffect(()=>{
        let limit = 30;
        let usersRequest = new CometChat.UsersRequestBuilder()
                  .setLimit(limit)
                  .setSearchKeyword(search)
                  .build();
        usersRequest.fetchNext().then(
            userList => {
                console.log("User list received:", userList);
            }, error => {
                console.log("User list fetching failed with error:", error);
            }
        );
    }   
    ,[search]);


    
    return (
        <div>
            <div class="chat_searchbar">
                <input type="text" class="chat_search_input" placeholder="Search" onChange={(e)=>{setSearch(e.target.value)}}></input>
            </div>
        </div>

    )
}

export default ChatSearchbar