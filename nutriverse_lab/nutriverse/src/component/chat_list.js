import '../pages/css/Chat.css'
import { ChatItem,MessageList,Input } from 'react-chat-elements';
import close_icon from '../assets/close_icon.png';
import React,{useEffect, useState} from 'react';
import Button from 'react-bootstrap/esm/Button';
import { CometChat } from "@cometchat/chat-sdk-javascript";
import Chat_searchbar from './Chat_searchbar';



const ChatList = (props)=>{

    useEffect(()=>{
        get_chats();
        
    },[]);
    


    const [name, setName] = useState('');
    const [list_users, update_list_user] = useState([]);
    const [users_render, update_users_render] = useState([]);
    const [message_list, update_message_list] = useState([]);
    
    var messageListReferance = React.createRef();
    var inputReferance = React.createRef();


    function get_chats(){
        
        let limit = 30;
        let conversationsRequest = new CometChat.ConversationsRequestBuilder().setLimit(limit).build();
        conversationsRequest.fetchNext().then(
        conversationList => {
            console.log("Conversations list received:", conversationList);
            update_users_render(conversationList);
            
            
        }, error => {
            console.log("Conversations list fetching failed with error:", error);
        }
    );
    }

    var get_messages = (uid, name)=>{
        
        props.change_list_display(false);
        setName(name);
        var messagesRequest = new CometChat.MessagesRequestBuilder()
        .setUID(uid)
        .setLimit(30)
        .build();
        messagesRequest.fetchPrevious().then(
        messages => {
            console.log("Message list fetched:", messages);
            messages.map((message)=>{
                var new_message = {
                    position: message.receiverId === uid ? 'right' : 'left',
                    type: 'text',
                    text: message.text,
                    date: new Date(message.sentAt*1000)
                }
                update_message_list([...message_list, new_message]);
            });
        },
        error => {
            console.log("Message fetching failed with error:", error);
        }
        );


    }
    
    var input_value;

    const array_list_items =  users_render.map((user)=>
        <ChatItem
                avatar={''}
                uid={user.conversationWith.uid}
                alt={user.conversationWith.name}
                title={user.conversationWith.name}
                subtitle={user.lastMessage.text}
                date={user.lastMessage.sentAt*1000}
                unread={user.unreadMessageCount}
                onClick={()=>{get_messages(user.conversationWith.uid, user.conversationWith.name)}}
            />
    )

    
    function render_chatbox(){
        return(
            <div class="chatlist_box">
                <div class="chat_heading">
                    <center>
                    <h5 class="exit_chat" onClick={()=>{props.change_list_display(true); update_message_list([])}}>&lt;chats</h5>
                        <h3 class="chat_name">{name}</h3>
                        </center>
                </div>
            <div>
            <div class="space_block"></div>
            <MessageList
            referance={messageListReferance}
            className='message-list'
            lockable={true}
            toBottomHeight={'100%'}
            dataSource={message_list} />
    </div>
    
    <div class="input_field">
        
        <Input class="input_field_text"
            referance={inputReferance}
            placeholder='Type here...'
            multiline={true}
            value={input_value}
            rightButtons={<Button color='white' backgroundColor='black' text='Send' />}
        />
        
    </div>
    </div> 
        )
    }
   

    return (
      <div class="chat_box">
        <div class="heading">
            <h1 class="chat_title" >Chat</h1>
            <img class="close_icon" onClick={()=>{props.change_visibility(true)}} src={close_icon} alt="close" width="40" ></img>
        </div>
        <div class="scrollable_list">
            {
                props.display_list ? array_list_items : render_chatbox()
            }
        
          
        </div>       
      </div>
    )
}

export default ChatList