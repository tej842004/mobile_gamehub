import { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, Image, Alert } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import { supabase } from "./app/lib/supabase";

import Screen from "./app/components/Screen";
import AppTextInput from "./app/components/AppTextInput";
import AppButton from "./app/components/AppButton";
import LoginScreen from "./app/screen/LoginScreen";
import RegisterScreen from "./app/screen/RegisterScreen";
import WelcomeScreen from "./app/screen/WelcomeScreen";
import AuthNavigator from "./app/navigation/authNavigator";
import navigationTheme from "./app/navigation/navigationTheme";
import Home from "./app/components/Home";
import { AuthProvider, useAuth } from "./app/context/AuthContext";

import ListItem from "./app/components/ListItem";
import Icon from "./app/components/Icon";
import AccountScreen from "./app/screen/AccountScreen";
import CreateScreen from "./app/screen/CreateScreen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import AccountNavigator from "./app/navigation/accountNavigator";
import FeedNavigator from "./app/navigation/FeedNavigator";
import AppNavigator from "./app/navigation/appNavigator";
import * as ImagePicker from "expo-image-picker";

export default function App() {
  return (
    <GestureHandlerRootView>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </GestureHandlerRootView>
  );
}

const AppContent = () => {
  const { user } = useAuth();

  return (
    <NavigationContainer theme={navigationTheme}>
      {user ? <AppNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
};
