import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GateScreen } from "./Activity/GateScreen";
import { PharmacistAuthScreen } from "./Activity/Auth/ParmasistAuthScreen";
import { PatientAuthScreen } from "./Activity/Auth/PatientAuthScreen";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Gate",
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Gate: GateScreen,
    PharmacistAuth: PharmacistAuthScreen,
    PatientAuth: PatientAuthScreen,
  },
});

export { RootStack };
