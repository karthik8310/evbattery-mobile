import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Dashboard from "./screens/Dashboard";
import ENC from "./screens/ENC";
import AIML from "./screens/AIML";
import Graphs from "./screens/Graphs";
import Alerts from "./screens/Alerts";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#0a84ff",
          tabBarStyle: { paddingBottom: 6, height: 60 },
        })}
      >
        <Tab.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="view-dashboard"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="ENC"
          component={ENC}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="thermometer"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="AIML"
          component={AIML}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="robot" color={color} size={size} />
            ),
          }}
        />
        <Tab.Screen
          name="Graphs"
          component={Graphs}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons
                name="chart-line"
                color={color}
                size={size}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Alerts"
          component={Alerts}
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialCommunityIcons name="bell" color={color} size={size} />
            ),
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
