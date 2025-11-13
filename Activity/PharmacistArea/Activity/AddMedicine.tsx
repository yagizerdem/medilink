import React, { useCallback, useMemo, useRef } from "react";
import { View, Text, StyleSheet, Insets } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useSharedValue } from "react-native-reanimated";
import { ContainerLayoutState } from "@gorhom/bottom-sheet/lib/typescript/types";

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

function AddMedicineForm() {
  return (
    <View
      style={{
        flex: 1,
        marginHorizontal: 20,
        backgroundColor: "white",
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        padding: 20,
        shadowColor: "#000",
        shadowOpacity: 0.15,
        shadowRadius: 10,
      }}
    >
      {/* ===== Başlık ===== */}
      <Text
        style={{
          fontSize: 22,
          fontWeight: "700",
          marginBottom: 20,
          color: "#1f2937",
        }}
      >
        İlaç Bilgisi Ekle
      </Text>

      {/* ===== Input: İlaç Adı ===== */}
      <View
        style={{
          backgroundColor: "#E7F4F4",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
          İlaç Adı
        </Text>
        <Text style={{ fontSize: 16, color: "#111827" }}> </Text>
      </View>

      {/* ===== Input: Hasta E-posta ===== */}
      <View
        style={{
          backgroundColor: "#E7F4F4",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 10,
          marginBottom: 14,
        }}
      >
        <Text style={{ fontSize: 14, color: "#6b7280", marginBottom: 4 }}>
          Hasta E-posta
        </Text>
        <Text style={{ fontSize: 16, color: "#111827" }}>fatma@gmail.com</Text>
      </View>

      {/* ===== Tarihler ===== */}
      <View
        style={{
          backgroundColor: "#E7F4F4",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, color: "#111827" }}>Başlangıç Tarihi</Text>
        <Text style={{ fontSize: 16, color: "#6b7280" }}>📅</Text>
      </View>

      <View
        style={{
          backgroundColor: "#E7F4F4",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 14,
          marginBottom: 14,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <Text style={{ fontSize: 16, color: "#111827" }}>Bitiş Tarihi</Text>
        <Text style={{ fontSize: 16, color: "#6b7280" }}>📅</Text>
      </View>

      {/* ===== Dozaj ===== */}
      <View
        style={{
          backgroundColor: "#E7F4F4",
          borderRadius: 12,
          paddingHorizontal: 14,
          paddingVertical: 12,
          marginBottom: 20,
        }}
      >
        <Text style={{ fontSize: 16, color: "#111827" }}>
          Dozaj (örnek: 1 tablet)
        </Text>
      </View>
    </View>
  );
}
