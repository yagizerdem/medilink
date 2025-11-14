import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../../Provider/AppProvider";

export function About() {
  const navigation = useNavigation();
  const { profile } = useApp();

  function goBack() {
    if (profile?.type === 1) {
      //@ts-ignore
      navigation.navigate("PatientApp" as never, { screen: "Dashboard" });
    } else {
      //@ts-ignore
      navigation.navigate("PharmacistApp" as never, { screen: "Settings" });
    }
  }

  return (
    <ScrollView className="flex-1 bg-teal-50 px-5 pt-6">
      {/* Header */}

      <View className="flex flex-row items-center  h-12 ">
        <TouchableOpacity className="w-12 " onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f766e" />
        </TouchableOpacity>
        <View className="flex-row items-center">
          <Ionicons
            name="information-circle-outline"
            size={26}
            color="#0f766e"
          />
          <Text className="text-2xl font-semibold text-teal-700 ml-2">
            About
          </Text>
        </View>
      </View>

      {/* App Title */}
      <Text className="text-3xl font-bold text-teal-700 mb-1">Medilink</Text>
      <Text className="text-gray-500 mb-4">v1.0.0</Text>

      {/* Description */}
      <Text className="text-gray-700 leading-6 mb-6">
        Medilink helps users manage their medications efficiently with a
        comprehensive medication tracking and management assistant. The app
        simplifies medication use while ensuring a safe and organized treatment
        process.
      </Text>

      {/* Section Title */}
      <Text className="text-xl font-bold text-teal-700 mb-3">
        Key Features:
      </Text>

      {/* Features List */}
      <View className="bg-white rounded-2xl p-4 mb-6 shadow-md">
        <Text className="text-gray-700 mb-2">
          • Medication reminders for consistent usage.
        </Text>
        <Text className="text-gray-700 mb-2">
          • Barcode scanning for quick access to drug info.
        </Text>
        <Text className="text-gray-700 mb-2">
          • Personal profile and health information management.
        </Text>
        <Text className="text-gray-700 mb-2">
          • Notifications to alert you about important drug schedules.
        </Text>
        <Text className="text-gray-700">
          • Secure data storage and full compliance with privacy policies.
        </Text>
      </View>

      {/* Description */}
      <Text className="text-gray-700 leading-6 mb-6">
        Medilink offers an intuitive interface and advanced technology to
        simplify health management. It is designed for users of all ages and
        provides valuable support for your treatment process.
      </Text>

      {/* Contact Section */}
      <Text className="text-xl font-bold text-teal-700 mb-3">Contact Us:</Text>

      <View className="bg-white rounded-2xl p-4 shadow-md mb-10">
        <Text className="text-gray-700 mb-2">Email: support@medilink.com</Text>
        <Text className="text-gray-700">Web: www.medilink.com</Text>
      </View>
    </ScrollView>
  );
}
