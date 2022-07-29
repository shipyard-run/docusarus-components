import React, {cloneElement, Children} from "react"
import PropTypes from 'prop-types'

import "./VSCodeBrowser.css"

const VSCodeBrowser = ({ children, uri, title }) => {
    const arrayChildren = Children.toArray(children);
    return (
        <>
        {Children.map(arrayChildren, (child, index) => {
          return cloneElement(child, { 
            onClick: () => window.parent.window.postMessage({"uri": uri, "title": title, "function": "openHtml"}, "*")
          })
        })}
        </>
    )
}

export default VSCodeBrowser 

VSCodeBrowser.propTypes = {
  uri: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}