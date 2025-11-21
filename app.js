import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import Dashboard from "./src/screens/Dashboard";
import ENC from "./src/screens/ENC";
import AIML from "./src/screens/AIML";
import Graphs from "./src/screens/Graphs";
import Alerts from "./src/screens/Alerts";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Dashboard"
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarActiveTintColor: "#0084ff",
          tabBarStyle: { paddingBottom: 6, height: 60 },
          tabBarIcon: ({ color, size }) => {
            let icon;

            if (route.name === "Dashboard") icon = "home";
            else if (route.name === "ENC") icon = "battery";
            else if (route.name === "AIML") icon = "brain";
            else if (route.name === "Graphs") icon = "chart-line";
            else if (route.name === "Alerts") icon = "bell";

            return (
              <MaterialCommunityIcons name={icon} color={color} size={size} />
            );
          },
        })}
      >
        <Tab.Screen name="Dashboard" component={Dashboard} />
        <Tab.Screen name="ENC" component={ENC} />
        <Tab.Screen name="AIML" component={AIML} />
        <Tab.Screen name="Graphs" component={Graphs} />
        <Tab.Screen name="Alerts" component={Alerts} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
