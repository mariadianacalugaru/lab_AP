import React, { Component, useState } from 'react'
import ChatIcon from '../component/ChatIcon'
import './css/Chat.css'
import ChatList from '../component/chat_list';


export default class Chat extends Component {
    constructor(props){
        super(props);

        this.state = {
            icon_visibility: true,
            display_list: true
        };
    }
    change_visibility = (visibility)=>{
        var new_state = this.state;
        new_state.icon_visibility = visibility;
        this.setState(new_state);
    }
    change_list_display = (list_state)=>{
        var new_state = this.state;
        new_state.display_list = list_state;
        this.setState(new_state);

    }
    
  render() {
    return (
    <>
    <h1>Questa è la chat</h1>
    {this.state.icon_visibility ? <ChatIcon change_visibility={this.change_visibility} ></ChatIcon> : <ChatList display_list={this.state.display_list} change_visibility={this.change_visibility} change_list_display={this.change_list_display}></ChatList> }
    </>
    )
  }
}
