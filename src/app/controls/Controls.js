import TextField from '@material-ui/core/TextField';
import {CopyToClipboard} from 'react-copy-to-clipboard';
import Button from '@material-ui/core/Button';
import AssignmentIcon from '@material-ui/icons/Assignment';
import IconButton from '@material-ui/core/IconButton';
import PhoneIcon from '@material-ui/icons/Phone';
import React from 'react';
import './Controls.css';

function Controls(props) {
    return (
        <div className="controls">
            <TextField
                id="filled-basic"
                label="Name"
                variant="filled"
                value={props.name}
                onChange={e => {
                    props.setName(e.target.value);
                    localStorage.setItem('name', e.target.value);
                }}
                style={{marginBottom: "20px"}}
            />
            <CopyToClipboard text={props.myId} style={{
                marginBottom: '2rem',
                background: 'black',
                color: 'white'
            }}>
                <Button variant="contained" color="inherit" startIcon={<AssignmentIcon fontSize="large"/>}>
                    Copy ID
                </Button>
            </CopyToClipboard>
            <TextField
                id="filled-basic"
                label="ID to call"
                variant="filled"
                value={props.idToCall}
                onChange={e => props.setIdToCall(e.target.value)}
            />
            <div className="call-button">
                {props.callAccepted && !props.callEnded ? (
                    <Button variant="contained" color="secondary" onClick={props.leaveCall}>
                        End Call
                    </Button>
                ) : (
                    <IconButton color="inherit" aria-label="call" onClick={() => {
                        props.callUser(props.idToCall);
                        props.setCalling(true);
                    }}>
                        <PhoneIcon fontSize="large"/>
                    </IconButton>
                )}
            </div>
        </div>
    );
}

export default Controls;