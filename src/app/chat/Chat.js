import BasicScrollToBottom from "react-scroll-to-bottom";
import React from "react";
import './Chat.css';

function Chat(props) {
    return (
        <div className="chat-window" style={props.darkMode ? {outline: 'solid white'} : {outline: 'solid black'}}>
            <div className="chat-title">
                <p>Chat</p>
            </div>
            <BasicScrollToBottom className="chat-content">
                {props.messageHistory.map((messageData) => {
                    return (
                        <div className="message"
                             id={messageData.id === props.myId ? 'you' : 'partner'}
                             data-testid={messageData.id === props.myId ? 'you' : 'partner'}>
                            <div className="message-content">
                                <p>{messageData.message}</p>
                            </div>
                            <div className="message-metadata">
                                <span>{messageData.name ? messageData.name + ' - ' + messageData.time : messageData.time}</span>
                            </div>
                        </div>
                    );
                })}
            </BasicScrollToBottom>
            <div className="chat-content-container">
                <input
                    className="chat-message"
                    type="text"
                    placeholder="Enter message..."
                    value={props.currentMessage}
                    onChange={event => props.setCurrentMessage(event.target.value)}
                    onKeyPress={event => {
                        if (event.key === 'Enter') {
                            props.sendMessage();
                        }
                    }}
                />
                <button className="send" onClick={props.sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

export default Chat;