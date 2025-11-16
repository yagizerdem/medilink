import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";
import { useState, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";
import { useApp } from "../../../Provider/AppProvider";
import Toast from "react-native-toast-message";
import { isOperationalError } from "../../../util/isOperationalError";
import { FirebaseError } from "firebase/app";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";

export function PatientLayout({ children }) {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const slide = useRef(new Animated.Value(-280)).current;

  function onAdkGeminiChatPress() {}

  const toggleDrawer = () => {
    Animated.timing(slide, {
      toValue: open ? -280 : 0,
      duration: 250,
      useNativeDriver: false,
    }).start();
    setOpen(!open);
  };

  return (
    <View className="flex-1 bg-teal-50">
      {/* Toggle Button */}
      <TouchableOpacity onPress={toggleDrawer} className="p-3">
        <Ionicons name="menu" size={28} color="#0a6d52" />
      </TouchableOpacity>

      {/* OVERLAY */}
      {open && (
        <Pressable
          onPress={toggleDrawer}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0,0,0,0.25)",
            zIndex: 40,
          }}
        />
      )}

      {/* DRAWER */}
      <Animated.View
        pointerEvents="auto"
        style={{
          position: "absolute",
          top: 0,
          left: slide,
          width: 280,
          height: "100%",
          backgroundColor: "white",
          zIndex: 50,
          elevation: 50,
        }}
      >
        <CustomDrawer navigation={navigation} closeDrawer={toggleDrawer} />
      </Animated.View>

      {/* CONTENT */}
      <View className="flex-1 bg-teal-50">
        <View className="flex-1">{children}</View>
        <View className="items-end w-full">
          <TouchableOpacity
            onPress={onAdkGeminiChatPress}
            className="
      flex-row items-center 
      bg-white 
      rounded-full 
      px-5 py-2
      h-12
      w-64
      mb-6
      shadow
      self-end
    "
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.06,
              shadowRadius: 6,
              elevation: 2,
            }}
          >
            <Text className="text-[#0f766e] font-medium text-base mr-2">
              Bana soru sorabilirsin
            </Text>

            <View
              className="w-5 h-5 rounded-full items-center justify-center"
              style={{ backgroundColor: "#ffd6e7" }}
            >
              <Text style={{ fontSize: 12 }}>💬</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export default function CustomDrawer({ navigation, closeDrawer }) {
  const { profile, setIsLoading } = useApp();

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

  return (
    <View className="flex-1 bg-white">
      <View className="bg-[#0a6d52] px-6 py-10">
        <View className="w-14 h-14 rounded-full bg-white items-center justify-center mb-2">
          <Text className="text-xl font-bold text-[#0a6d52]">
            {profile?.firstName.charAt(0) || ""}
          </Text>
        </View>

        <Text className="text-white text-lg font-semibold">
          {profile?.firstName} {profile?.lastName}
        </Text>
        <Text className="text-white/80 text-sm">{profile?.email}</Text>
      </View>

      <View className="px-4 mt-4">
        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => {
            navigation.navigate("PatientApp", { screen: "MyMedicines" });
            closeDrawer();
          }}
        >
          <Ionicons name="medkit-outline" size={22} color="#334155" />
          <Text className="ml-3 text-[#334155] text-base">My Medicines</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => {
            navigation.navigate("PatientApp", { screen: "Diagnoses" });
            closeDrawer();
          }}
        >
          <Ionicons name="shield-checkmark-outline" size={22} color="#334155" />
          <Text className="ml-3 text-[#334155] text-base">Diagnoses</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => {
            navigation.navigate("DataManagement");
            closeDrawer();
          }}
        >
          <Ionicons name="lock-closed-outline" size={22} color="#334155" />
          <Text className="ml-3 text-[#334155] text-base">Privacy</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => {
            navigation.navigate("About");
            closeDrawer();
          }}
        >
          <Ionicons
            name="information-circle-outline"
            size={22}
            color="#334155"
          />
          <Text className="ml-3 text-[#334155] text-base">About</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3"
          onPress={() => {
            navigation.navigate("Settings");
            closeDrawer();
          }}
        >
          <Ionicons name="settings-outline" size={22} color="#334155" />
          <Text className="ml-3 text-[#334155] text-base">Settings</Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="flex-row items-center py-3 mt-4"
          onPress={() => logout()}
        >
          <Ionicons name="log-out-outline" size={22} color="#d9534f" />
          <Text className="ml-3 text-[#d9534f] text-base font-medium">
            Log out
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
