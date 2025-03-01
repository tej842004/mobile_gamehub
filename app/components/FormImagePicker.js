import React from "react";
import { useFormikContext } from "formik";

import ImageInputList from "./ImageInputList";
import ErrorMessage from "./ErrorMessage";

const FormImagePicker = ({ name }) => {
  const { errors, setFieldValue, touched, values } = useFormikContext();

  return (
    <>
      <ImageInputList
        imageUri={values[name]}
        onAddImage={(uri) => setFieldValue(name, uri)}
        onRemoveImage={() => setFieldValue(name, null)}
      />
      <ErrorMessage error={errors[name]} visible={touched[name]} />
    </>
  );
};

export default FormImagePicker;
