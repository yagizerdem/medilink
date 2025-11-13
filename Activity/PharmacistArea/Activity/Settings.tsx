import { View, Text, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useApp } from "../../../Provider/AppProvider";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { FirebaseError } from "firebase/app";
import { isOperationalError } from "../../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";

export function Settings() {
  const { profile, setIsLoading } = useApp();
  const navigation = useNavigation();

  async function logout() {
    try {
      setIsLoading(true);
      const auth = getAuth(app);

      await auth.signOut();

      Toast.show({
        type: "success",
        text1: "logout successful!",
      });

      navigation.navigate("Gate" as never);
    } catch (error) {
      if (error instanceof FirebaseError && isOperationalError(error)) {
        Toast.show({
          type: "error",
          text1: getFriendlyAuthMessage(error),
        });
      } else {
        Toast.show({
          type: "error",
          text1: "An unknown error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  function navigateToDataManagement() {
    //@ts-ignore
    navigation.navigate("DataManagement");
  }

  function navigateToAbout() {
    //@ts-ignore
    navigation.navigate("About");
  }

  return (
    <View className="flex-1 bg-teal-50 px-5 pt-6">
      <Text className="text-2xl font-semibold text-teal-700 text-center mb-6">
        Settings
      </Text>

      <View className="bg-white rounded-2xl p-4 flex-row items-center shadow-md mb-6">
        <View className="w-12 h-12 bg-teal-100 rounded-full justify-center items-center mr-3">
          <Ionicons name="person" size={26} color="#0f766e" />
        </View>

        <View>
          <Text className="text-lg font-semibold text-teal-700">
            Pharm. {profile?.firstName || ""} {profile?.lastName || ""}
          </Text>
          <Text className="text-gray-500 text-sm">{profile?.email || ""}</Text>
        </View>
      </View>

      <SettingsItem
        icon="lock-closed-outline"
        title="Privacy"
        subtitle="Data management & permissions"
        onPressOut={navigateToDataManagement}
      />

      <SettingsItem
        icon="information-circle-outline"
        title="About"
        subtitle="Application information"
        onPressOut={navigateToAbout}
      />

      <SettingsItem
        icon="exit-outline"
        title="Log Out"
        subtitle="Sign out of your account"
        isDanger
        onPressOut={logout}
      />
    </View>
  );
}

function SettingsItem({
  icon,
  title,
  subtitle,
  isDanger,
  onPressOut,
}: {
  icon: any;
  title: string;
  subtitle: string;
  isDanger?: boolean;
  onPressOut?: () => void;
}) {
  return (
    <TouchableOpacity
      className="bg-white rounded-2xl p-4 flex-row justify-between items-center shadow-md mb-4"
      onPressOut={onPressOut}
    >
      <View className="flex-row items-center">
        <Ionicons
          name={icon}
          size={24}
          color={isDanger ? "#dc2626" : "#0f766e"}
        />
        <View className="ml-3">
          <Text
            className={`text-base font-semibold ${
              isDanger ? "text-red-600" : "text-teal-700"
            }`}
          >
            {title}
          </Text>
          <Text className="text-gray-500 text-xs mt-0.5">{subtitle}</Text>
        </View>
      </View>

      <Ionicons name="chevron-forward-outline" size={20} color="#6b7280" />
    </TouchableOpacity>
  );
}
