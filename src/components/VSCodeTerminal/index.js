import React, {cloneElement, Children} from "react"
import PropTypes from 'prop-types'

import "./VSCodeTerminal.css"

const VSCodeTerminal = ({ children, command, name }) => {
    const arrayChildren = Children.toArray(children);
    return (
        <>
        {Children.map(arrayChildren, (child, index) => {
          return cloneElement(child, { 
            onClick: () => window.parent.window.postMessage({"command": command, "name": name, "function": "openTerminal"}, "*")
          })
        })}
        </>
    )
}

export default VSCodeTerminal

VSCodeTerminal.propTypes = {
  command: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
}