import '../pages/css/Chat.css'
import { ChatItem,MessageList,Input } from 'react-chat-elements';
import close_icon from '../assets/close_icon.png';
import send_icon from '../assets/send.png';
import back_icon from '../assets/back.png';
import no_avatar from '../assets/no_avatar.png';
import React,{useEffect, useState} from 'react';
import Button from 'react-bootstrap/esm/Button';
import { CometChat } from "@cometchat/chat-sdk-javascript";
import Chat_searchbar from './Chat_searchbar';
import { CometChatUIKit } from "@cometchat/chat-uikit-react";
import { CometChatUIKitConstants } from "@cometchat/uikit-resources";



const ChatList = (props)=>{

    useEffect(()=>{
        get_chats();
        
    },[]);
    


    const [name, setName] = useState('');
    const [list_users, update_list_user] = useState([]);
    const [users_render, update_users_render] = useState([]);
    const [message_list, update_message_list] = useState([]);
    const [destination, setDestination] = useState('');
    const [message_list_render, update_message_list_render] = useState([]);
    const [message_text, set_message_text] = useState('');
    const [inside_chat, set_inside_chat] = useState(false);
    
    var messageListReferance = React.createRef();
    var inputReferance = React.createRef();




    const sendMessage = ()=>{
        
        const receiverId = destination;
        const receiverType = CometChatUIKitConstants.MessageReceiverType.user;
        const textMessage = new CometChat.TextMessage(
          receiverId,
          message_text,
          receiverType
        );
      
        CometChatUIKit.sendTextMessage(textMessage)
        .then((message) => {
          console.log("Message sent successfully:", message);
          })
        .catch(console.log);

        set_message_text('');
        get_messages(destination,name);


    
    }



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
        setDestination(uid);
        props.change_list_display(false);
        setName(name);
        var messagesRequest = new CometChat.MessagesRequestBuilder().setUID(uid).setLimit(30).build();
        messagesRequest.fetchPrevious().then(
        messages => {
            console.log("Message list fetched:", messages);
            update_message_list(messages);
            var message_to_append;
            var list_rendering = [];
            for(var i=0; i<messages.length; i++){
                console.log(messages[i].text);
                message_to_append = {
                    position: messages[i].sender.uid === uid ? 'left' : 'right',
                    type: 'text',
                    text: messages[i].text,
                    date: messages[i].sentAt*1000
                }
                list_rendering.push(message_to_append);
            }
            update_message_list(list_rendering);
        },
        error => {
            console.log("Message fetching failed with error:", error);
            update_message_list([]);
        }
        );

        console.log(message_list);

        

        

    }
    
    var input_value;

    const array_list_items =  users_render.map((user)=>
        <ChatItem
                avatar={no_avatar}
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
                    <h5 class="exit_chat" onClick={()=>{props.change_list_display(true); update_message_list([]); setDestination('');}}><img src={back_icon} className="back_icon"></img></h5>
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
            multiline={false}
            value={input_value}
            onChange={(e)=>{input_value = e.target.value; set_message_text(e.target.value);}}
            rightButtons={<Button className="invio" onClick={()=>{ sendMessage(); get_messages(destination,name)}}><img src={send_icon} className="send_icon"></img></Button>}
        />
        
    </div>
    </div> 
        )
    }
   

    return (
      <div class="chat_box">
        <div class="heading">
            <h2 class="chat_title" >Chat</h2>
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