import React from "react";
import { Button as NativeButton, View, StyleSheet } from "react-native";

const Button = ({ text, wrapperStyle = {}, ...props }) => (
  <View style={StyleSheet.flatten([wrapperStyle])}>
    <NativeButton title={text} {...props} />
  </View>
);

export default Button;
