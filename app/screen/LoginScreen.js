import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import AppForm from "../components/AppForm";
import Screen from "../components/Screen";
import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";

const validationSchema = Yup.object().shape({
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const LoginScreen = () => {
  const { signIn } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignIn = async (values) => {
    setError("");
    setLoading(true);
    try {
      await signIn(values);
    } catch (error) {
      setError(error.message);
    }
    setLoading(false);
  };

  return (
    <Screen style={styles.container}>
      <ErrorMessage error={error} visible={error} />
      <AppForm
        initialValues={{ email: "", password: "" }}
        onSubmit={handleSignIn}
        validationSchema={validationSchema}
      >
        <AppFormField
          placeholder="Email"
          icon="email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          textContentType="emailAddress"
          name="email"
        />
        <AppFormField
          placeholder="Password"
          icon="lock"
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          textContentType="password"
          name="password"
        />
        <SubmitButton title="Login" />
      </AppForm>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default LoginScreen;
