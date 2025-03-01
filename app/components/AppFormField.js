import React from "react";
import { useFormikContext } from "formik";

import AppTextInput from "./AppTextInput";
import ErrorMessage from "../components/ErrorMessage";

const AppFormField = ({ name, ...otherProps }) => {
  const { handleChange, setFieldTouched, touched, errors } = useFormikContext();

  return (
    <>
      <AppTextInput
        onChangeText={handleChange(name)}
        onBlur={() => setFieldTouched(name)}
        {...otherProps}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default AppFormField;
