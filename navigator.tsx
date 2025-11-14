import { createStaticNavigation } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { GateScreen } from "./Activity/GateScreen";
import { PharmacistAuthScreen } from "./Activity/Auth/PharmacistAuthScreen";
import { PatientAuthScreen } from "./Activity/Auth/PatientAuthScreen";

import { Dashboard as PharmacistDashboard } from "./Activity/PharmacistArea/Activity/Dashboard";
import { AddMedicine as PharmacistAddMedicine } from "./Activity/PharmacistArea/Activity/AddMedicine";
import { Patients as PharmacistPatients } from "./Activity/PharmacistArea/Activity/Patients";
import { Settings as PharmacistSettings } from "./Activity/PharmacistArea/Activity/Settings";
import { Stock as PharmacistStock } from "./Activity/PharmacistArea/Activity/Stock";
import { PharmacistLayout } from "./Activity/PharmacistArea/Layout/PharmasistLayout";
import { DataManagement } from "./Activity/Common/DataManagement";
import { About } from "./Activity/Common/About";

import { Dashboard as PatientDashboard } from "./Activity/PatientArea/Activity/Dashboard";
import { PatientLayout } from "./Activity/PatientArea/Layout/PatientLayout";

export const PharmacistStack = createNativeStackNavigator({
  initialRouteName: "Dashboard",
  screenOptions: { headerShown: false },
  screens: {
    Dashboard: PharmacistDashboard,
    AddMedicine: PharmacistAddMedicine,
    Patients: PharmacistPatients,
    Settings: PharmacistSettings,
    Stock: PharmacistStock,
  },
  layout: PharmacistLayout,
});

export const PatientStack = createNativeStackNavigator({
  initialRouteName: "Dashboard",
  screenOptions: { headerShown: false },
  screens: {
    Dashboard: PatientDashboard,
    Privacy: DataManagement,
    About: About,
  },
  layout: PatientLayout,
});

const RootStack = createNativeStackNavigator({
  initialRouteName: "Gate",
  screenOptions: {
    headerShown: false,
  },
  screens: {
    Gate: GateScreen,
    PharmacistAuth: PharmacistAuthScreen,
    PatientAuth: PatientAuthScreen,
    DataManagement: DataManagement,
    About: About,
    PharmacistApp: {
      screen: PharmacistStack,
    },
    PatientApp: {
      screen: PatientStack,
    },
  },
});

export { RootStack };
