import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import Personas from "./screens/Personas";



const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Personas">
      <Stack.Screen name="Inicio" component={Personas} options={{ title: "  Lista de Personas" }} />
      
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;