import React from "react";
import { Text } from "react-native";

import defaultStyle from "../config/styles";

const AppText = ({ children, style, ...otherProps }) => {
  return (
    <Text {...otherProps} style={[defaultStyle.text, style]}>
      {children}
    </Text>
  );
};

export default AppText;
