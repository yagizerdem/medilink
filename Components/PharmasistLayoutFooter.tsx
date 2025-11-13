import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { Fragment } from "react";
import {
  getFocusedRouteNameFromRoute,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

export function PharmacistLayoutFooter() {
  const navigation = useNavigation();
  const route = useRoute();

  const current = getFocusedRouteNameFromRoute(route) || "Dashboard";

  return (
    <View className="w-full h-20 bg-teal-900 flex-row justify-between items-center px-4">
      {/* Dashboard */}
      <FooterTab
        label="Dashboard"
        icon="grid-outline"
        isActive={current === "Dashboard"}
        onPress={() =>
          //@ts-ignore
          navigation.navigate("PharmacistApp", { screen: "Dashboard" })
        }
      />

      {/* Add Medicine */}
      <FooterTab
        label="Add Medicine"
        icon="medkit-outline"
        isActive={current === "AddMedicine"}
        onPress={() =>
          //@ts-ignore
          navigation.navigate("PharmacistApp", {
            screen: "AddMedicine",
          })
        }
      />

      {/* Patients (NOW NORMAL TAB) */}
      <FooterTab
        label="Patients"
        icon="people-outline"
        isActive={current === "Patients"}
        onPress={() =>
          //@ts-ignore
          navigation.navigate("PharmacistApp", {
            screen: "Patients",
          })
        }
      />

      {/* Stock */}
      <FooterTab
        label="Stock"
        icon="cube-outline"
        isActive={current === "Stock"}
        onPress={() =>
          //@ts-ignore
          navigation.navigate("PharmacistApp", {
            screen: "Stock",
          })
        }
      />

      {/* Settings */}
      <FooterTab
        label="Settings"
        icon="settings-outline"
        isActive={current === "Settings"}
        onPress={() =>
          //@ts-ignore
          navigation.navigate("PharmacistApp", {
            screen: "Settings",
          })
        }
      />
    </View>
  );
}

function FooterTab({
  label,
  icon,
  isActive,
  onPress,
}: {
  label: string;
  icon: any;
  isActive: boolean;
  onPress: () => void;
}) {
  if (isActive) {
    return (
      <TouchableOpacity
        onPress={onPress}
        className="flex-1 justify-center items-center"
        style={{ marginTop: -30 }}
      >
        <View className="w-20 h-20 my-12 rounded-t-[35px] justify-center items-center bg-teal-900  border-4 border-teal-900">
          <Ionicons name={icon} size={32} color="#0f766e" />
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-1 justify-center items-center py-2"
    >
      <Ionicons name={icon} size={22} color="white" />
      <Text className="text-xs text-white mt-1">{label}</Text>
    </TouchableOpacity>
  );
}
