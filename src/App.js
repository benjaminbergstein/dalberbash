import React, { useState } from 'react';
import logo from './logo.svg';
import './App.css';

const servers = null;
const localConnection = new RTCPeerConnection(servers);
const remoteConnection = new RTCPeerConnection(servers);
const sendChannel = localConnection.createDataChannel('sendDataChannel');

const DEFAULT_DRAFT = "Your Message...";
const CONN_STATUSES = {
  CONNECTED: 'connected',
  DISCONNECTED: 'disconnected',
};

const App = () => {
  const [message, setMessage] = useState("Welcome");
  const [draft, setDraft] = useState(DEFAULT_DRAFT);
  const [connectionStatus, setConnectionStatus] = useState(DEFAULT_DRAFT);

  console.log('asdfa')
  const sendDraft = () => {
    sendChannel.send(draft);
    setDraft(DEFAULT_DRAFT);
  };

  const onReceiveMessage = ({ data }) => setMessage(data);
  localConnection.onicecandidate = e => {
    console.log(e);
  };
  remoteConnection.onicecandidate = e => {
    console.log(e);
  };
  remoteConnection.ondatachannel = (event) => {
    console.log('asfa');
	const receiveChannel = event.channel;
	receiveChannel.onmessage = onReceiveMessage;
    receiveChannel.onopen = () => { setConnectionStatus(CONN_STATUSES.CONNECTED); };
    receiveChannel.onclose = () => { setConnectionStatus(CONN_STATUSES.DISCONNECTED); };
  };

  localConnection.createOffer().then((desc) => {
    console.log(desc);
    localConnection.setLocalDescription(desc);
    remoteConnection.setRemoteDescription(desc);
    remoteConnection.createAnswer().then((desc2) => {
      remoteConnection.setLocalDescription(desc2);
      localConnection.setRemoteDescription(desc2);
      console.log(desc2);
    });
  });

  return (
    <div>
      {connectionStatus !== CONN_STATUSES.CONNECTED && (
        <div>Disconnected</div>
      )}
      {connectionStatus === CONN_STATUSES.CONNECTED && (
        <form onSubmit={sendDraft}>
          <input type="text" onChange={({ target }) => setDraft(target.value)}/>
          <button>Send</button>
        </form>
      )}
    </div>
  );
}

export default App;
