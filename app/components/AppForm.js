import React from "react";
import { StyleSheet } from "react-native";
import { Formik } from "formik";

const AppForm = ({ children, initialValues, onSubmit, validationSchema }) => {
  return (
    <Formik
      initialValues={initialValues}
      onSubmit={onSubmit}
      validationSchema={validationSchema}
    >
      {() => <>{children}</>}
    </Formik>
  );
};
const styles = StyleSheet.create({
  container: {},
});

export default AppForm;
