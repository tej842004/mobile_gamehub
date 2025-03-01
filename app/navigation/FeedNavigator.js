import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import ListingScreen from "../screen/ListingScreen";
import ListingDetailsScreen from "../screen/ListingDetailsScreen";
import Games from "../components/Games";
import GameDetail from "../components/GameDetail";

const Stack = createNativeStackNavigator();

const AuthNavigator = () => (
  <Stack.Navigator screenOptions={{ presentation: "modal" }}>
    <Stack.Screen
      name="Games"
      component={Games}
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="GameDetail"
      component={GameDetail}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AuthNavigator;
