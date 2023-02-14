import PubSub from 'pubsub-js';
import React, {Children} from "react"
import PropTypes from 'prop-types'
import Button from '@mui/material/Button';
import TerminalIcon from '@mui/icons-material/Terminal';

import "./index.css"

class TerminalRunCommand extends React.Component {
  constructor(props) {
    super(props);

    this.onClick = this.onClick.bind(this);
  }

  componentDidMount() {
    let command = "";
    Children.map(this.props.children, (child, index) => {
      if (child.type.name === "Command" || child.props.mdxType === "Command") {
        // add the carriage returns 
        let formattedText = child.props.children.replaceAll(';', '\r');
        formattedText = formattedText.replaceAll('\\', '\\\r');
        command += formattedText + "\r";
      }
    })

    this.setState({command: command});
  }

  onClick() {
    PubSub.publish('terminal.runCommand', {id: this.props.target, command: this.state.command});
  }

  render() {
    const buttonText = this.props.text || "Run Command in Terminal";

    return (
      <p>
        <Button variant="contained" endIcon={<TerminalIcon />} onClick={this.onClick}>
          {buttonText}
        </Button>
      </p>
    )
  }
}

export default TerminalRunCommand

TerminalRunCommand.propTypes = {
  target: PropTypes.string.isRequired,
  text: PropTypes.string
}