import { View, Text } from "react-native";
import { useApp } from "../../../Provider/AppProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

export function Dashboard() {
  const { profile } = useApp();

  return (
    <View>
      <Text className="text-2xl font-semibold text-teal-600 mx-auto my-4 ">
        Welcome,{" "}
        <Text className="font-bold text-teal-700">
          {profile?.firstName} {profile?.lastName}
        </Text>{" "}
        👋
      </Text>
    </View>
  );
}
