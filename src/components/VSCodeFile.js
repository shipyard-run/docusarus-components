import React, {cloneElement, Children} from "react"
import PropTypes from 'prop-types'

import "./VSCodeFile.css"

const VSCodeFile = ({ children, uri, title }) => {
    const arrayChildren = Children.toArray(children);
    return (
        <>
        {Children.map(arrayChildren, (child, index) => {
          return cloneElement(child, { 
            onClick: () => window.parent.window.postMessage({"uri": uri, "title": title, "function": "openFile"}, "*")
          })
        })}
        </>
    )
}

export default VSCodeFile

VSCodeFile.propTypes = {
  uri: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}