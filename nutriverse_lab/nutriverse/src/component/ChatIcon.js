import icon from '../assets/chat_icon.png'
import '../pages/css/Chat.css'

const ChatIcon = (props)=>{
    return (
      <div>
        <img class="ChatIcon" src={icon} alt='chat' onClick={()=>{props.change_visibility(false)}} ></img>
      </div>
    )
}

export default ChatIcon