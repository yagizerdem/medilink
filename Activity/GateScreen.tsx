import { Text, View, Image, Button, TouchableOpacity } from "react-native";
import LottieView from "lottie-react-native";
import { useRef } from "react";
import { Dimensions } from "react-native";
import { cn } from "../util/twUtil";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useNavigation } from "@react-navigation/native";

export function GateScreen() {
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const animation = useRef<LottieView>(null);
  const navigation = useNavigation();

  async function goToPharmacistLoginActivity() {
    navigation.navigate("PharmacistAuth" as never);
  }

  async function goToPatientLoginActivity() {
    navigation.navigate("PatientAuth" as never);
  }

  return (
    <View className="flex-1 flex flex-col ">
      <View
        className={cn(
          ` flex mx-auto my-4 rounded-3xl flex-col items-center justify-center shadow-md bg-white`
        )}
        style={{
          width: windowWidth / 2,
          height: windowWidth / 2,
        }}
      >
        <Image source={require("../assets/heart.png")} className="w-24 h-24" />

        <Text className="font-bold text-xl text-green-900">MEDILINK</Text>
        <Text className="font-medium text-sm text-green-500">
          Pharamedical Company
        </Text>
      </View>

      <Text className="font-medium text-3xl mx-auto text-green-400">
        Welcome to medilink
      </Text>

      <LottieView
        autoPlay
        ref={animation}
        style={{
          width: windowWidth,
          height: windowHeight / 3 + 50,
        }}
        source={require("../assets/docAnimation.json")}
      />
      <View className="gap-3 w-1/2 mx-auto my-10">
        <TouchableOpacity
          onPress={goToPharmacistLoginActivity}
          className="bg-purple-600 py-3 rounded-lg active:opacity-80 flex flex-row items-center justify-center gap-2"
        >
          <Ionicons name="medkit" size={24} color="white" />

          <Text className="text-white text-center font-semibold">
            Pharmacist Login
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={goToPatientLoginActivity}
          className="bg-purple-600 py-3 rounded-lg active:opacity-80 flex flex-row items-center justify-center gap-2"
        >
          <Ionicons name="person" size={24} color="white" />
          <Text className="text-white text-center font-semibold">
            Patient Login
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
