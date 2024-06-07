import React, { Component, useState } from 'react'
import ChatIcon from '../component/ChatIcon'
import './css/Chat.css'
import ChatList from '../component/chat_list';
import { CometChat } from "@cometchat/chat-sdk-javascript";
import axios from 'axios';


const COMETCHAT_CONSTANTS = {
    APP_ID: "2589434882a1e59d",
    REGION: "eu",
    AUTH_KEY: "aa4a13b501cff5df95b8abab018299a1c68f5e17",
  };



export default class Chat extends Component {
    constructor(props){
        super(props);

        this.state = {
            icon_visibility: true,
            display_list: true,
            user: undefined
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

    componentDidMount() {
        this.init();
      }
    
      init() {
        CometChat.init(
          COMETCHAT_CONSTANTS.APP_ID,
          new CometChat.AppSettingsBuilder()
            .setRegion(COMETCHAT_CONSTANTS.REGION)
            .subscribePresenceForAllUsers()
            .build()
        ).then(
          () => {
            this.login();
          },
          (error) => {
            console.log("Init failed with exception:", error);
          }
        );
      }

     get_chats(){
        let limit = 30;
        let conversationsRequest = new CometChat.ConversationsRequestBuilder().setLimit(limit).build();
        conversationsRequest.fetchNext().then(
        conversationList => {
            console.log("Conversations list received:", conversationList);
        }, error => {
            console.log("Conversations list fetching failed with error:", error);
        }
    ); 

    }

    async login() {
        let UID;
        var configuration = {
            headers: {
              "Content-Type": 'multipart/form-data',
              "Access-Control-Allow-Origin": "http://localhost:4000",
            },
            
            withCredentials: true,
        }
        var name;
        await axios.get("http://localhost:4000/userId",configuration).then((res) => {UID = res.data._id; name =res.data.firstname + ' ' + res.data.lastname;});
        console.log(UID);
        CometChat.login(UID, COMETCHAT_CONSTANTS.AUTH_KEY).then(
          (user) => {
            this.setState({ user });
            let limit = 30;
            let conversationsRequest = new CometChat.ConversationsRequestBuilder().setLimit(limit).build();
            conversationsRequest.fetchNext().then(
            conversationList => {
                console.log("Conversations list received:", conversationList);
            }, error => {
            console.log("Conversations list fetching failed with error:", error);
            }
    ); 
            
          },
          (error) => {
            console.log("Login failed with exception:", error);
            if (error.code === "ERR_UID_NOT_FOUND") {
                var user_registration = new CometChat.User(UID);
                user_registration.setName(name);
                CometChat.createUser(user_registration, COMETCHAT_CONSTANTS.AUTH_KEY).then(
                    (user) => {
                      console.log("user created", user);
                    },
                    (error) => {
                      console.log("error", error);
                    }
                  );
                  CometChat.login(UID, COMETCHAT_CONSTANTS.AUTH_KEY).then(
                    (user) => {
                      this.setState({ user });
                    },
                    (error) => {
                      console.log("Login failed with exception:", error);})
          }}
    
        );
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


