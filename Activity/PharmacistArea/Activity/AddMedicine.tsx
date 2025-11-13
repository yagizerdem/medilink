import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Insets, TouchableOpacity } from "react-native";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";

export function AddMedicine() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={["80%", "20%"]}
        backgroundStyle={{ backgroundColor: "transparent" }}
      >
        <BottomSheetView className="w-full h-full">
          <View
            style={{
              flex: 1,
              marginHorizontal: 20,
              backgroundColor: "white",
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              padding: 20,
              shadowColor: "#000",
              shadowOpacity: 0.15,
              shadowRadius: 10,
            }}
          >
            <AddMedicineForm />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "grey",
  },
  contentContainer: {
    flex: 1,
    padding: 36,
    alignItems: "center",
  },
});

export function AddMedicineForm() {
  return (
    <View className="flex-1 bg-white rounded-t-3xl">
      {/* Başlık */}
      <Text className="text-2xl font-bold text-center  text-teal-800 mx-auto mb-5 w-full">
        Add Medicine Information
      </Text>

      <View className="w-full bg-[#E7F4F4] rounded-full px-4 py-3 flex-row items-center mb-4">
        <Ionicons name="grid-outline" size={22} color="#0f766e" />

        <TextInput
          placeholder="Barcode number"
          placeholderTextColor="#6b7280"
          className="flex-1 ml-3 text-base text-gray-800"
        />

        <TouchableOpacity>
          <Ionicons name="camera-outline" size={24} color="#0f766e" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
