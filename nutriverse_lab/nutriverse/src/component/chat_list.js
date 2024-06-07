import '../pages/css/Chat.css'
import { ChatItem,MessageList,Input } from 'react-chat-elements';
import close_icon from '../assets/close_icon.png';
import React,{useState} from 'react';
import Button from 'react-bootstrap/esm/Button';
import { CometChat } from "@cometchat/chat-sdk-javascript";



const ChatList = (props)=>{
    const [name, setName] = useState('');
    const [list_users, update_list_user] = useState([]);

    let limit = 30;
        let conversationsRequest = new CometChat.ConversationsRequestBuilder().setLimit(limit).build();
        conversationsRequest.fetchNext().then(
        conversationList => {
            console.log("Conversations list received:", conversationList);
            update_list_user(conversationList);
        }, error => {
            console.log("Conversations list fetching failed with error:", error);
        });
    
    var messageListReferance = React.createRef();
    var inputReferance = React.createRef();
    var users = list_users.map((conversation) => {
        return {
            alt: conversation.conversationWith.name,
            title: conversation.conversationWith.name,
            subtitle: conversation.lastMessage.text,
            date: new Date(conversation.lastMessage.sentAt * 1000),
            unread: conversation.unreadMessageCount,
            onClick: () => {
                props.change_list_display(false);
                setName(conversation.conversationWith.name);
            }
        };
    });
    
    var input_value;

    const array_list_items =  users.map((user)=>
        <ChatItem
                avatar={user.avatar}
                alt={user.alt}
                title={user.title}
                subtitle={user.subtitle}
                date={user.date}
                unread={user.unread}
                onClick={()=>{props.change_list_display(false); setName(user.title)}}
            />
    )

    
    function render_chatbox(){
        return(
            <div class="chatlist_box">
                <div class="chat_heading">
                    <center>
                    <h5 class="exit_chat" onClick={()=>{props.change_list_display(true)}}>&lt;chats</h5>
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
            dataSource={[
	    {
	        position: 'right',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },
        {
	        position: 'left',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },{
	        position: 'right',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },{
	        position: 'right',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },{
	        position: 'left',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },{
	        position: 'left',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },{
	        position: 'left',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },{
	        position: 'left',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    },{
	        position: 'left',
	        type: 'text',
	        text: 'Lorem ipsum dolor sit amet, consectetur adipisicing elit',
	        date: new Date(),
	    }

	]} />
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