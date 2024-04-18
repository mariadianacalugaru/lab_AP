import React, { Component, useState } from 'react'
import ChatIcon from '../component/ChatIcon'
import './css/Chat.css'
import ChatList from '../component/chat_list';


export default class Chat extends Component {
    constructor(props){
        super(props);

        this.state = {
            icon_visibility: true
        };
    }
    change_visibility = (visibility)=>{
        this.setState({
            icon_visibility: visibility
        })
    }
  render() {
    return (
    <>
    <h1>Questa è la chat</h1>
    {this.state.icon_visibility ? <ChatIcon change_visibility={this.change_visibility}></ChatIcon> : <ChatList change_visibility={this.change_visibility}></ChatList> }
    </>
    )
  }
}
