import { View, Text } from "react-native";
import { useApp } from "../../../Provider/AppProvider";
import Ionicons from "@expo/vector-icons/Ionicons";

export function Dashboard() {
  const { profile } = useApp();

  const fullName =
    profile?.firstName && profile?.lastName
      ? `${profile.firstName} ${profile.lastName}`
      : "User";

  return (
    <View className="flex-1 bg-teal-50 items-center justify-center px-6">
      {/* Heart Icon */}
      <Ionicons
        name="heart"
        size={42}
        color="#0f766e"
        style={{ marginBottom: 10 }}
      />

      {/* Welcome Title */}
      <Text className="text-2xl font-bold text-[#0f766e] mb-2 text-center">
        Welcome, {fullName}!
      </Text>

      {/* Subtitle */}
      <Text className="text-gray-600 text-base text-center">
        You can easily access your health information here.
      </Text>
    </View>
  );
}
