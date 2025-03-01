import React, { useState } from "react";
import { StyleSheet } from "react-native";
import * as Yup from "yup";

import Screen from "../components/Screen";
import AppForm from "../components/AppForm";
import AppFormField from "../components/AppFormField";
import SubmitButton from "../components/SubmitButton";
import { useAuth } from "../context/AuthContext";
import ErrorMessage from "../components/ErrorMessage";
import { supabase } from "../lib/supabase";

const validationSchema = Yup.object().shape({
  name: Yup.string().required().min(2).max(50).label("Name"),
  email: Yup.string().required().email().label("Email"),
  password: Yup.string().required().min(4).label("Password"),
});

const RegisterScreen = () => {
  const { signUp } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignUp = async (values) => {
    setError("");
    setLoading(true);

    try {
      const { user, error } = await signUp(values);
      if (error) throw error;

      if (user) {
        const { error: profileError } = await supabase
          .from("profiles")
          .insert([{ id: user.id, name: values.name, email: values.email }]);

        if (profileError) throw profileError;
      }
    } catch (error) {
      setError(error.message);
    }

    setLoading(false);
  };

  return (
    <Screen style={styles.container}>
      <ErrorMessage error={error} visible={error} />
      <AppForm
        initialValues={{ name: "", email: "", password: "" }}
        onSubmit={handleSignUp}
        validationSchema={validationSchema}
      >
        <AppFormField
          placeholder="Full Name"
          icon="account"
          autoCorrect={false}
          name="name"
        />
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
        <SubmitButton title="Register" />
      </AppForm>
    </Screen>
  );
};
const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
});

export default RegisterScreen;
