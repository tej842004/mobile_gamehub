import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import AccountScreen from "../screen/AccountScreen";
import CreateScreen from "../screen/CreateScreen";
import PostScreen from "../screen/PostScreen";
import ListingDetailsScreen from "../screen/ListingDetailsScreen";
import BookmarksScreen from "../screen/BookmarkScreen";
import LikesScreen from "../screen/LikeScreen";
import ProfileScreen from "../screen/ProfileScreen";

const Stack = createNativeStackNavigator();

const AccountNavigator = () => (
  <Stack.Navigator>
    <Stack.Screen name="Account" component={AccountScreen} />
    <Stack.Screen name="Create" component={CreateScreen} />
    <Stack.Screen name="Posts" component={PostScreen} />
    <Stack.Screen name="Bookmarks" component={BookmarksScreen} />
    <Stack.Screen name="Likes" component={LikesScreen} />
    <Stack.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ headerBackVisible: false }}
    />
    <Stack.Screen
      name="ListingDetails"
      component={ListingDetailsScreen}
      options={{ headerShown: false }}
    />
  </Stack.Navigator>
);

export default AccountNavigator;
