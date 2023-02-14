import React, {Children} from "react"
import PropTypes from 'prop-types'
import Drawer from '@mui/material/Drawer';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import IconButton from '@mui/material/IconButton';
import FullscreenIcon from '@mui/icons-material/Fullscreen';
import FullscreenExitIcon from '@mui/icons-material/FullscreenExit';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import Box from '@mui/material/Box';
import PubSub from 'pubsub-js';

import "./TerminalVisor.css"

class TerminalVisor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      fullScreen: false,
      selectedTab: 0,
      minimized: this.props.minimized || false,
      visorHeight: "400px"
    };

    this.clickFullScreen = this.clickFullScreen.bind(this);
    this.tabChange = this.tabChange.bind(this);
    this.setResizeFunc = this.setResizeFunc.bind(this);
    this.toggleMinimized = this.toggleMinimized.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleMouseUp = this.handleMouseUp.bind(this);

    this.resizeFuncs = [];
  }

  componentDidMount() {
    PubSub.subscribe('terminal.runCommand', (msg, data) => {
      // do we have the terminal referenced by this message in our collection
      // if se make sure it is selected
      Children.map(this.props.children, (child, index) => {
        if (child.props.id === data.id) {
          this.setState({selectedTab: index, minimized: false});
        }
      })
    });
  }
  
  componentWillUnmount() {
    PubSub.unsubscribe('terminal.runCommand')
  }

  componentDidUpdate() {
    // resize terminals
    let n=0;
    this.resizeFuncs.forEach((resizeFunc) => {
      if(this.state.selectedTab === n) {
        setTimeout(resizeFunc,200);
      } 
      n++;
    });
  }

  clickFullScreen() {
    if (this.state.fullScreen) {
      this.setState({fullScreen: false});
    } else {
      this.setState({fullScreen: true});
      this.setState({minimized: false});
    }
  }

  toggleMinimized() {
    if (this.state.minimized) {
      this.setState({minimized: false});
    } else {
      this.setState({minimized: true});
    }
  }

  tabChange(e,newValue) {
    this.setState({selectedTab: newValue});
  }

  setResizeFunc(resizeFunc) {
    this.resizeFuncs.push(resizeFunc);
  }

  handleMouseDown(e) {
    document.addEventListener("mouseup", this.handleMouseUp, true);
    document.addEventListener("mousemove", this.handleMouseMove, true);
  }

  handleMouseUp() {
    document.removeEventListener("mouseup", this.handleMouseUp, true);
    document.removeEventListener("mousemove", this.handleMouseMove, true);
  }

  handleMouseMove(e) {
    const newHeight = window.innerHeight - e.clientY;
    console.log("move", newHeight);
    this.setState({visorHeight: newHeight + "px"});
    //if (newWidth > minDrawerWidth && newWidth < maxDrawerWidth) {
    //  setDrawerWidth(newWidth);
    //}
  }

  render() {
    let visorHeight = this.state.fullScreen ? "100vh" : this.state.visorHeight;
    const selectedTab = this.state.selectedTab;
    const minimized = this.state.minimized;
    const fullscreen = this.state.fullScreen

    if (minimized) {
      visorHeight = "60px";
    }

    return (
      <Drawer
      anchor="bottom"
      open={true} variant="persistent" PaperProps={{ style: { height: visorHeight } }}>

        <div className="dragger" onMouseDown={this.handleMouseDown}/>

        <Box sx={{ display:'flex'}}>
          <Box sx={{flexGrow:1}}>

            <Tabs
              value={selectedTab}
              onChange={this.tabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="terminal windows">

              {Children.map(this.props.children, (child, index) => {
                return <Tab label={child.props.name}/>
              })}

            </Tabs>

          </Box>
          <Box>

            <IconButton aria-label="up" onClick={this.toggleMinimized}>
              {minimized ? (
                <KeyboardArrowUpIcon />
              ) : (
                <KeyboardArrowDownIcon />
              )}
            </IconButton>

          </Box>
          <Box>

            <IconButton aria-label="delete" onClick={this.clickFullScreen}>
            {fullscreen ? (
              <FullscreenExitIcon />
            ) : (
              <FullscreenIcon />
            )}
            </IconButton>

          </Box>
        </Box>

        {Children.map(this.props.children, (child, index) => {
        const display = selectedTab === index ? "inline-flex" : "none"

        return (
          <Box style={{height: '100vh', width: '100%', overflow: 'hidden', display: display }}>
            { React.cloneElement(child, {...child.props, expanded: true, resizeFunc: this.setResizeFunc, hidden: selectedTab !== index}) }
          </Box>
        )

        })}

      </Drawer>
    )
  }
}

export default TerminalVisor 

TerminalVisor.propTypes = {
  minimized: PropTypes.bool
}