import React from "react";
import { useFormikContext } from "formik";

import AppButton from "./AppButton";

const SubmitButton = ({ title, disabled }) => {
  const { handleSubmit } = useFormikContext();
  return <AppButton title={title} onPress={handleSubmit} disable={disabled} />;
};

export default SubmitButton;
