import { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

enum PanelMode {
  LOGIN,
  REGISTER,
}

export function PharmacistAuthScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [mode, setMode] = useState<PanelMode>(PanelMode.LOGIN);

  function switchPanel(mode_: PanelMode) {
    setMode(mode_);
  }

  useEffect(() => {
    setEmail("");
    setPassword("");
    setFirstName("");
    setLastName("");
  }, [mode]);

  return (
    <View className="flex-1 justify-center items-center bg-teal-50 px-5">
      {mode == PanelMode.LOGIN && (
        <View className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg">
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-teal-100 rounded-full justify-center items-center">
              <Text className="text-teal-700 text-3xl font-bold">+</Text>
            </View>
            <Text className="text-2xl font-semibold text-teal-700 mt-3">
              Pharmacist Login
            </Text>
            <Text className="text-gray-500 text-sm">
              Welcome! Please sign in
            </Text>
          </View>

          {/* Email */}
          <View className="border border-teal-500 rounded-lg flex-row items-center px-3 mb-4">
            <Ionicons name="mail" color="#0f766e" size={20} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              className="flex-1 p-2 text-gray-700"
            />
          </View>

          {/* Password */}
          <View className="border border-teal-500 rounded-lg flex-row items-center px-3 mb-6">
            <Ionicons name="lock-closed" color="#0f766e" size={20} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6b7280"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              className="flex-1 p-2 text-gray-700"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Ionicons name="eye-off" color="#0f766e" size={20} />
              ) : (
                <Ionicons name="eye" color="#0f766e" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {/* Login button */}
          <TouchableOpacity className="bg-teal-700 py-3 rounded-lg flex-row justify-center items-center active:opacity-90">
            <Ionicons name="log-in" color="white" size={18} />
            <Text className="text-white text-center font-semibold ml-2">
              Sign In
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="mt-4"
            onPress={() => switchPanel(PanelMode.REGISTER)}
          >
            <Text className="text-center text-teal-700 underline font-medium">
              Register if you don't have an account
            </Text>
          </TouchableOpacity>
        </View>
      )}
      {mode == PanelMode.REGISTER && (
        <View className="w-full max-w-sm bg-white rounded-2xl p-6 shadow-lg">
          {/* Header */}
          <View className="items-center mb-6">
            <View className="w-16 h-16 bg-teal-100 rounded-full justify-center items-center">
              <Text className="text-teal-700 text-3xl font-bold">+</Text>
            </View>
            <Text className="text-2xl font-semibold text-teal-700 mt-3">
              Pharmacist Register
            </Text>
            <Text className="text-gray-500 text-sm">
              Please fill in your information to create an account
            </Text>
          </View>

          {/* First Name */}
          <View className="border border-teal-500 rounded-lg flex-row items-center px-3 mb-4">
            <Ionicons name="person" color="#0f766e" size={20} />
            <TextInput
              placeholder="First Name"
              placeholderTextColor="#6b7280"
              value={firstName}
              onChangeText={setFirstName}
              className="flex-1 p-2 text-gray-700"
            />
          </View>

          {/* Last Name */}
          <View className="border border-teal-500 rounded-lg flex-row items-center px-3 mb-4">
            <Ionicons name="person-outline" color="#0f766e" size={20} />
            <TextInput
              placeholder="Last Name"
              placeholderTextColor="#6b7280"
              value={lastName}
              onChangeText={setLastName}
              className="flex-1 p-2 text-gray-700"
            />
          </View>

          {/* Email */}
          <View className="border border-teal-500 rounded-lg flex-row items-center px-3 mb-4">
            <Ionicons name="mail" color="#0f766e" size={20} />
            <TextInput
              placeholder="Email"
              placeholderTextColor="#6b7280"
              value={email}
              onChangeText={setEmail}
              className="flex-1 p-2 text-gray-700"
            />
          </View>

          {/* Password */}
          <View className="border border-teal-500 rounded-lg flex-row items-center px-3 mb-6">
            <Ionicons name="lock-closed" color="#0f766e" size={20} />
            <TextInput
              placeholder="Password"
              placeholderTextColor="#6b7280"
              secureTextEntry={!showPassword}
              value={password}
              onChangeText={setPassword}
              className="flex-1 p-2 text-gray-700"
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              {showPassword ? (
                <Ionicons name="eye-off" color="#0f766e" size={20} />
              ) : (
                <Ionicons name="eye" color="#0f766e" size={20} />
              )}
            </TouchableOpacity>
          </View>

          {/* Register button */}
          <TouchableOpacity className="bg-teal-700 py-3 rounded-lg flex-row justify-center items-center active:opacity-90">
            <Ionicons name="person-add" color="white" size={18} />
            <Text className="text-white text-center font-semibold ml-2">
              Register
            </Text>
          </TouchableOpacity>

          {/* Already have account */}
          <TouchableOpacity
            className="mt-4"
            onPress={() => switchPanel(PanelMode.LOGIN)}
          >
            <Text className="text-center text-teal-700 underline font-medium">
              Already have an account? Log in
            </Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}
