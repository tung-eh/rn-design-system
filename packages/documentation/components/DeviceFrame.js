import React from "react";
import "./devices.min.css";

const IPhoneX = ({ id = "iphone-frame", children, screenStyle }) => (
  <div className="marvel-device iphone-x" id={id}>
    <div className="notch">
      <div className="camera"></div>
      <div className="speaker"></div>
    </div>
    <div className="top-bar"></div>
    <div className="sleep"></div>
    <div className="bottom-bar"></div>
    <div className="volume"></div>
    <div
      className="screen"
      style={{
        boxSizing: "border-box",
        ...screenStyle,
      }}
    >
      {children}
    </div>
  </div>
);

export { IPhoneX };
