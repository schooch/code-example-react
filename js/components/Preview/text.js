import React from "react";
import Parser from "html-react-parser";

const PreviewText = props => (
  <div className="post-text">{Parser(props.text)}</div>
);

export default PreviewText;
