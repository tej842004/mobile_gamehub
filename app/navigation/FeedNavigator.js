import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListingScreen from "../screen/ListingScreen";
import ListingDetailsScreen from "../screen/ListingDetailsScreen";
import ProfileScreen from "../screen/ProfileScreen";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ presentation: "modal" }}>
    <Stack.Screen
      name="ListingScreen"
      component={ListingScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="ListingDetails"
      component={ListingDetailsScreen}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerBackVisible: false }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
