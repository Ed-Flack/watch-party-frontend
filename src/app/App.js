import Button from '@material-ui/core/Button';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import Peer from 'simple-peer';
import io from 'socket.io-client';
import Chat from './chat/Chat';
import Controls from './controls/Controls';
import { Switch } from "@material-ui/core";
import './App.css';
import ReactPlayer from 'react-player';

const socket = io.connect('https://spectacular-clafoutis-c6f414.netlify.app');

function App() {

    const [myId, setMyId] = useState('');
    const [receivingCall, setReceivingCall] = useState(false);
    const [caller, setCaller] = useState('');
    const [callerSignal, setCallerSignal] = useState();
    const [callAccepted, setCallAccepted] = useState(false);
    const [idToCall, setIdToCall] = useState('');
    const [callEnded, setCallEnded] = useState(false);
    const [name, setName] = useState('');
    const [partnerName, setPartnerName] = useState('');
    const [currentMessage, setCurrentMessage] = useState('');
    const [messageHistory, setMessageHistory] = useState([]);
    const [calling, setCalling] = useState(false);
    const [darkMode, setDarkMode] = useState(true);

    const [playing, setPlaying] = useState(false);

    const [time, setTime] = useState(0);
    const [isReady, setIsReady] = useState(false);
    const [canUpdate, setCanUpdate] = useState(true);

    const playerRef = useRef()

    const connectionRef = useRef();

    useEffect(() => {
        localStorage.getItem('name') ? setName(localStorage.getItem('name')) : setName('');
        if (localStorage.getItem('darkMode') === 'false') {
            setDarkMode(false);
            document.getElementsByTagName('body').item(0).style.background = 'white';
        } else {
            setDarkMode(true);
            document.getElementsByTagName('body').item(0).style.background = 'black';
        }

        socket.on('myId', id => {
            setMyId(id);
        });

        socket.on('callUser', data => {
            setReceivingCall(true);
            setCaller(data.from);
            setPartnerName(data.name);
            setCallerSignal(data.signal);
        });

        socket.on('receiveMessage', data => {
            setMessageHistory(list => [...list, data]);
        })

        socket.on('callEnded', () => {
            setCallEnded(true);
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        });

        socket.on('receivePlay', data => {
            //make sure the receive does not re-initiate the send
            console.log(data);
            if (data.videoTime) {
                playerRef.current.seekTo(data.videoTime, 'seconds');
            }
            console.log('receive play');
            setPlaying(true);
            console.log('play value = ' + playing);
        });

        socket.on('receivePause', data => {
            console.log('receive pause');
            console.log('setting playing to false');
            console.log('play value = ' + playing);
            setPlaying(false);
        });

        socket.on('receiveUpdateTime', data => {
            console.log('Received update');
            onReady(false, data.videoTime);
        });

    });


    const callUser = id => {
        setCaller(id);
        const peer = new Peer({
            initiator: true,
            trickle: false,
        });

        peer.on('signal', data => {
            socket.emit('callUser', {
                userToCall: id,
                signalData: data,
                from: myId,
                name: name
            });
        });

        socket.on('callAccepted', signal => {
            setCallAccepted(true);
            peer.signal(signal);
        });

        connectionRef.current = peer;
    };

    const answerCall = () => {
        setCallAccepted(true);
        const peer = new Peer({
            initiator: false,
            trickle: false,
        });

        peer.on('signal', data => {
            socket.emit('answerCall', { signal: data, to: caller });
        });

        peer.signal(callerSignal);
        connectionRef.current = peer;
    }

    const leaveCall = () => {
        setCallEnded(true);
        socket.disconnect({ to: idToCall });
        setTimeout(() => {
            window.location.reload();
        }, 2000);
        // connectionRef.current.destroy();
    };

    const sendMessage = async () => {
        if (currentMessage !== '') {
            const messageData = {
                name: name,
                to: caller,
                id: myId,
                message: currentMessage,
                time: new Date(Date.now()).getHours().toString().padStart(2, '0') + ":" + new Date(Date.now()).getMinutes().toString().padStart(2, '0')
            };
            await socket.emit('sendMessage', messageData);
            setMessageHistory(history => [...history, messageData]);
            setCurrentMessage('');
        }
    }

    const play = async () => {
        console.log('am i called? (play)');
        if (!playing) {
            const error = new Error();
            console.log('play');
            console.log('----');
            console.log(
                error.stack);
            console.log('do I get here');
            if (!playing) {
                console.log('is this  called?');
                let data;
                data = {
                    name: name,
                    to: caller,
                    id: myId,
                    // videoTime: played
                };
                //need to send time? maybe predicted time the sender will be when the receiver receives?
                console.log('sending play');
                await socket.emit('play', data);
            }
            setPlaying(true);
        }
    }

    const pause = async () => {
        console.log('am i called? (pause)');
        if (playing) {
            const error = new Error();
            console.log('pause');
            console.log('-----');
            console.log(
                error.stack);
            // console.log(played);
            console.log('do I get in here?');
            if (playing) {
                const data = {
                    name: name,
                    to: caller,
                    id: myId,
                    // videoTime: played
                };
                console.log('sending pause');
                await socket.emit('pause', data);
            }
            setPlaying(false);
        }
    }

    const update = async (seconds) => {
        const data = {
            name: name,
            to: caller,
            id: myId,
            videoTime: seconds
        };
        await socket.emit('updateTime', data);
    }

    const onReady = React.useCallback((isReadyParam = true, time = 0) => {
        if (!isReady || !isReadyParam) {
            setCanUpdate(false);
            playerRef.current.seekTo(time, 'seconds');
            setIsReady(true);
        }
    }, [isReady]);

    return (
        <div>
            <h1 style={darkMode ? { color: 'white' } : { color: 'black' }} className="title">Eddie's Super Watch Party App<Switch
                color="secondary" className="dark-mode-toggle"
                checked={darkMode} onChange={() => {
                    if (darkMode) {
                        setDarkMode(false);
                        document.getElementsByTagName('body').item(0).style.background = 'white';
                        localStorage.setItem('darkMode', 'false');
                    } else {
                        setDarkMode(true);
                        document.getElementsByTagName('body').item(0).style.background = 'black';
                        localStorage.setItem('darkMode', 'true');
                    }

                }}
            /></h1>
            <div className="container">
                <div className="video-container">
                    <ReactPlayer
                        ref={playerRef}
                        url="video2.m4v"
                        height="100%"
                        width="100%"
                        controls={true}
                        onPlay={play}
                        onPause={pause}
                        playing={playing}
                        onReady={onReady}
                        onSeek={(seconds) => {
                            if (canUpdate) {
                                update(seconds);
                            } else {
                                setCanUpdate(true);
                            }
                        }}
                    />
                </div>
                <Controls setName={setName}
                    name={name}
                    myId={myId}
                    idToCall={idToCall}
                    setIdToCall={setIdToCall}
                    callAccepted={callAccepted}
                    callEnded={callEnded}
                    leaveCall={leaveCall}
                    callUser={callUser}
                    setCalling={setCalling}
                />
                <div>
                    {receivingCall && !callAccepted ? (
                        <div className="caller" style={darkMode ? { color: 'white' } : { color: 'black' }}>
                            <h1>{partnerName ? partnerName : "Unknown"} is calling...</h1>
                            <Button className="answer" variant="contained" style={{ background: "green", color: 'white' }}
                                color="inherit"
                                onClick={answerCall}>
                                Answer
                            </Button>
                        </div>
                    ) : calling && !callAccepted && idToCall ? (
                        <div className="caller" style={darkMode ? { color: 'white' } : { color: 'black' }}>
                            <h1>Calling {idToCall}...</h1>
                        </div>
                    ) : callEnded ? (
                        <div className="caller" style={darkMode ? { color: 'white' } : { color: 'black' }}>
                            <h1>Call ended</h1>
                        </div>
                    ) : null}
                </div>
                <br />
                {callAccepted && !callEnded ? (
                    <Chat messageHistory={messageHistory}
                        myId={myId}
                        currentMessage={currentMessage}
                        setCurrentMessage={setCurrentMessage}
                        sendMessage={sendMessage}
                        darkMode={darkMode} />
                ) : null}
            </div>
        </div>
    );
}

export default App;