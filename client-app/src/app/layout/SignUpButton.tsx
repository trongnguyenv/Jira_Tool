import React from "react";
import { createButton } from "react-social-login-buttons";

const config = {
  text: "Create an account",
  icon: "",
  //iconFormat: name => `fa fa-${name}`,
  style: { background: "#0E0F0F" },
  activeStyle: { background: "#0E0F0F" }
};
/** My Facebook login button. */
const SignUpButton = createButton(config);

export default SignUpButton;