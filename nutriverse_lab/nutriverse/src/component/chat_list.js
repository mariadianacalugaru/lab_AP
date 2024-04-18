import '../pages/css/Chat.css'
import { ChatItem } from 'react-chat-elements';
import close_icon from '../assets/close_icon.png'


const ChatList = (props)=>{
    return (
      <div class="chat_box">
        <div class="heading">
            <h1 class="chat_title" >Chat</h1>
            <img class="close_icon" onClick={()=>{props.change_visibility(true)}} src={close_icon} alt="close" width="40" ></img>
        </div>
        <div class="scrollable_list">
        <ChatItem
            avatar={'https://www.neoedizioni.it/neo/wp-content/uploads/2020/06/Mario-Rossi.jpg'}
            alt={'Reactjs'}
            title={'Mario Rossi'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0}
        />
        <ChatItem
            avatar={'https://femarimpiantisrl.it/wp-content/uploads/bfi_thumb/sortcode-03-oe01wbx2sqa53q87kpq7xxqnjc5zdqqguusxmfaado.jpg'}
            alt={'Reactjs'}
            title={'Giuseppe Bianchi'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0}
        />
        <ChatItem
            avatar={'https://www.nostrofiglio.it/images/2022/03/15/giornata-nazionale-per-la-salute-della-donna_900x760.jpg'}
            alt={'Reactjs'}
            title={'Michela Verdi'}
            subtitle={'What are you doing?'}
            date={new Date()}
            unread={0}
        />
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />  
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />  
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />  
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />  
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />  
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />  
        <ChatItem
            avatar={'https://www.forumcyber40.it/wp-content/uploads/2023/05/Mecella-1024x1024.jpg'}
            alt={'Reactjs'}
            title={'Massimo Mecella'}
            subtitle={'Nice App gays!'}
            date={new Date()}
            unread={0}
        />  
        </div>       
      </div>
    )
}

export default ChatList