import React from "react"
import PropTypes from 'prop-types'
import { Terminal as XTerm } from "xterm"
import { FitAddon } from "xterm-addon-fit"
import { AttachAddon } from 'xterm-addon-attach'
import ReconnectingWebSocket from 'reconnecting-websocket';
import PubSub from 'pubsub-js';

import "./terminal.css"

let termid = 0;

class Terminal extends React.Component {

  constructor(props) {
    super(props)

    this.id = "terminal_" + termid++

    const user = props.user || "root"
    const shell = props.shell || "/bin/bash"
    const workdir = props.workdir || "/"
    const path =`/terminal?target=${props.target}&workdir=${workdir}&user=${user}&shell=${shell}` 

    this.heartbeat = this.heartbeat.bind(this)
    this.resize = this.resize.bind(this)


    this.websocket = this.createWebSocket(path, props.webSocketURI)
    this.fitAddon = new FitAddon()

    // pass the resize event to the parent
    if (this.props.resizeFunc) {
      this.props.resizeFunc(this.resize)
    }
    
    this.state = {hidden: props.hidden || false}
  }
   
  createWebSocket(path, uri) {
    console.log("uri",uri)
    var protocolPrefix = (window.location.protocol === 'https:') ? 'wss:' : 'ws:';
    var addr = `${protocolPrefix}//${window.location.host}${path}`

    if(uri) {
      addr = `${uri}${path}`
    }

    console.log("Create websocket addr:", addr);

    const websocket = new ReconnectingWebSocket(addr);
    websocket.binaryType = 'arraybuffer'

    return websocket
  }

  resize() {
    console.log("Resize, hidden:",this.props.hidden,this.id)

    this.fitAddon.fit()
    const dimensions = this.fitAddon.proposeDimensions()
    this.websocket.send(new TextEncoder().encode("\x01" + JSON.stringify({cols: dimensions.cols, rows: dimensions.rows})))
  }
  
  heartbeat() {
    this.websocket.send(new TextEncoder().encode("\x09"))
  }

  componentDidMount() {
    PubSub.subscribe('terminal.runCommand', (msg, data) => {
      if(this.props.id === data.id) {
        console.log("received command", this.props.id, data.id, this.id, "command", data.command);

        this.websocket.send(new TextEncoder().encode("\x00" + data.command));
      }
    });

    // set a regular heart beat 
    setInterval(this.heartbeat, 10000)
        
    // Create the terminal
    this.terminal = new XTerm({
      fontFamily: 'Hack, Droid Sans Mono, Monospace',
      fontSize: 14,
      lineHeight: 1.1,
      cursorBlink: true,
      theme: { 
          "background": "#011627",
          "black": "#011627",
          "blue": "#82AAFF",
          "brightBlack": "#575656",
          "brightBlue": "#82AAFF",
          "brightCyan": "#7FDBCA",
          "brightGreen": "#22DA6E",
          "brightPurple": "#C792EA",
          "brightRed": "#EF5350",
          "brightWhite": "#FFFFFF",
          "brightYellow": "#FFEB95",
          "cyan": "#21C7A8",
          "foreground": "#D6DEEB",
          "green": "#22DA6E",
          "name": "Night Owl",
          "purple": "#C792EA",
          "red": "#EF5350",
          "white": "#FFFFFF",
          "yellow": "#ADDB67"
      }
    })
  
    // Load addons
    this.terminal.loadAddon(new AttachAddon(this.websocket))
    this.terminal.loadAddon(this.fitAddon)

    // Handle resizing
    window.addEventListener('resize', this.resize)

    // Encode our messages to the server
    this.terminal.onData(data => this.websocket.send(new TextEncoder().encode("\x00" + data)))

    // open the terminal within our element
    this.terminal.open(document.getElementById(this.id))

    // resize the terminal
    if(this.props.hidden) {
      return
    }
      
    this.fitAddon.fit()
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resize)
    PubSub.unsubscribe('terminal.runCommand');
  }

  render() {
      const termId = this.id

      return (
        <div id={termId} style={{ width: "100%", height: "100%"}}/>
      )
  }
}

export default Terminal

Terminal.propTypes = {
  target: PropTypes.string.isRequired,
  workdir: PropTypes.string,
  user: PropTypes.string,
  shell: PropTypes.string,
  resizeFunc: PropTypes.func,
  hidden: PropTypes.bool,
  websocketURI: PropTypes.string,
  id: PropTypes.string,
}
