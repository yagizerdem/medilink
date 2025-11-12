import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GateScreen } from "./Activity/GateScreen";
import { PharmacistAuthScreen } from "./Activity/Auth/PharmacistAuthScreen";
import { PatientAuthScreen } from "./Activity/Auth/PatientAuthScreen";
import { Dashboard as PharmacistDashBoardScreen } from "./Activity/PharmacistArea/Dashboard";

const RootStack = createNativeStackNavigator({
  initialRouteName: "Gate",
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Gate: GateScreen,
    PharmacistAuth: PharmacistAuthScreen,
    PatientAuth: PatientAuthScreen,
    PharmacistDashboard: PharmacistDashBoardScreen,
  },
});

export { RootStack };
