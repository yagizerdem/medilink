import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import {
  GestureHandlerRootView,
  TextInput,
} from "react-native-gesture-handler";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Ionicons } from "@expo/vector-icons";
import { useDebounce } from "../../../hooks/useDebounce";
import Toast from "react-native-toast-message";
import {
  addDoc,
  collection,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { WebView } from "react-native-webview";
import DateTimePicker from "@react-native-community/datetimepicker";
import { RadioButton } from "../../../Components/RadioButton";
import { Checkbox } from "../../../Components/Checkbox";
import { useApp } from "../../../Provider/AppProvider";
import { FirebaseError } from "firebase/app";
import { isOperationalError } from "../../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { validateEmail } from "../../../util/validateEmail";
import { getAuth } from "firebase/auth";
import { MedicineInfo } from "../../../shared/model/entity/MedicineInfo";
import { generatePushID } from "../../../util/generatePushID";
import { useNavigation } from "@react-navigation/native";

export function AddMedicine() {
  const bottomSheetRef = useRef<BottomSheet>(null);

  return (
    <GestureHandlerRootView style={styles.container}>
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={["80%", "20%"]}
        backgroundStyle={{ backgroundColor: "white" }}
      >
        <BottomSheetScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{
            padding: 20,
            paddingBottom: 100,
            backgroundColor: "white",
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
          }}
        >
          <AddMedicineForm />
        </BottomSheetScrollView>
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
  const { setIsLoading } = useApp();

  const [barcode, setBarcode] = useState<string | null>(null);
  const deboncedBarcode = useDebounce(barcode, 1200);
  const [geminiResponse, setGeminiResponse] = useState<string | null>(null);
  const [geminiLoading, setGeminiLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);

  // Date states:
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [usage, setUsage] = useState<"empty_stomach" | "with_food">(
    "empty_stomach"
  );

  const [times, setTimes] = useState<string[]>([]);
  const navigation = useNavigation();

  function toggleTime(t: "morning" | "noon" | "evening") {
    if (times.includes(t)) {
      setTimes(times.filter((x) => x !== t));
    } else {
      setTimes([...times, t]);
    }
  }

  async function handleSaveMedicInfo() {
    try {
      setIsLoading(true);

      if (!validateEmail(email)) {
        Toast.show({
          type: "error",
          text1: "Please enter a valid email address.",
        });
        return;
      }

      if (startDate && endDate && startDate > endDate) {
        Toast.show({
          type: "error",
          text1: "Start date cannot be later than end date.",
        });
        return;
      }

      if (startDate === null || endDate === null) {
        Toast.show({
          type: "error",
          text1: "Please select both start and end dates.",
        });
        return;
      }

      if (startDate && startDate.getTime() < Date.now()) {
        Toast.show({
          type: "error",
          text1: "Start date cannot be in the past.",
        });
        return;
      }

      const auth = getAuth(app);
      const pharmacistUid = auth.currentUser?.uid;
      if (!pharmacistUid) {
        Toast.show({
          type: "error",
          text1: "User not authenticated.",
        });
        return;
      }

      // Save medicine info to Firestore
      const db = getFirestore(app);
      const medicineInfo = {
        uid: generatePushID(),
        pharmacistUid,
        startDate: startDate.toISOString(),
        endDate: endDate.toISOString(),
        usage,
        barcode: barcode || "",
        times,
      } as MedicineInfo;

      const docRef = await addDoc(
        collection(db, "medicineInfos"),
        medicineInfo
      );

      Toast.show({
        type: "success",
        text1: "Medicine information added successfully.",
      });

      // @ts-ignore
      navigation.navigate("PharmacistApp", { screen: "Dashboard" });
    } catch (error) {
      console.error("Error adding patient: ", error);
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

  useEffect(() => {
    setGeminiResponse(null);
    if (!deboncedBarcode) return;

    const controller = new AbortController();
    const { signal } = controller;

    fetchDrug(signal);

    async function fetchDrug(signal: AbortSignal) {
      try {
        setGeminiLoading(true);

        const db = getFirestore(app);
        const colRef = collection(db, "stock");
        const q = query(colRef, where("barcode", "==", deboncedBarcode));
        const snapshot = await getDocs(q);

        if (signal.aborted) return;

        const firstDoc = snapshot.docs[0];
        if (!firstDoc || !firstDoc.exists()) return;

        const drugData = firstDoc.data() as any;
        const medicineName = drugData.medicineName;

        const drugInfo = await fetchDrugInfoFromNetwork(medicineName, signal);
        if (signal.aborted) return;

        setGeminiResponse(drugInfo);
      } catch (error: any) {
        if (error.name === "AbortError") {
          console.log("Request cancelled");
          return;
        }

        console.error("Fetch error:", error);
        Toast.show({
          type: "error",
          text1: "An unknown error occurred. Please try again.",
        });
      } finally {
        setGeminiLoading(false);
      }
    }

    return () => controller.abort();
  }, [deboncedBarcode]);

  return (
    <View className="flex-1 bg-white rounded-t-3xl px-6  ">
      <Text className="text-2xl font-bold text-center text-teal-800 my-5">
        Add Medicine Information
      </Text>

      {/* Barcode input */}
      <View className="w-full bg-[#E7F4F4] rounded-full px-4 py-3 flex-row items-center mb-6">
        <Ionicons name="grid-outline" size={22} color="#0f766e" />
        <TextInput
          placeholder="Barcode number"
          placeholderTextColor="#6b7280"
          className="flex-1 ml-3 text-base text-gray-800"
          value={barcode || ""}
          onChangeText={(text) => setBarcode(text)}
        />
        <TouchableOpacity>
          <Ionicons name="camera-outline" size={24} color="#0f766e" />
        </TouchableOpacity>
      </View>

      {geminiLoading && (
        <View className="flex flex-row items-center align-middle gap-4">
          <Text className="text-teal-700 text-base">Loading drug info...</Text>
          <ActivityIndicator size="small" />
        </View>
      )}

      {/* Response */}
      <DrugInfoView response={geminiResponse} />

      {/* Email input */}
      <View className="mb-4">
        <Text className="text-gray-600 text-sm mb-1">Email Address</Text>

        <View className="flex-row items-center bg-[#e6f7f4] rounded-xl px-3 py-4 border border-teal-500">
          <Ionicons
            name="person-outline"
            size={20}
            color="#0f766e"
            style={{ marginRight: 8 }}
          />

          <TextInput
            value={email}
            onChangeText={(text) => setEmail(text)}
            placeholder={"Enter email address"}
            placeholderTextColor="#6b7280"
            className="flex-1 text-[#0f766e] text-base"
          />
        </View>
      </View>

      <View className="mb-4">
        <Text className="text-gray-600 text-sm mb-1">Start Date</Text>

        <TouchableOpacity
          onPress={() => setShowStartPicker(true)}
          className="flex-row items-center bg-[#e6f7f4] rounded-xl px-3 py-4 border border-teal-500"
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#0f766e"
            style={{ marginRight: 8 }}
          />

          <Text className="text-[#0f766e] text-base flex-1">
            {startDate ? startDate.toLocaleDateString() : "Select start date"}
          </Text>
        </TouchableOpacity>

        {showStartPicker && (
          <DateTimePicker
            value={startDate || new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowStartPicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* end date */}
      <View className="mb-4">
        <Text className="text-gray-600 text-sm mb-1">End Date</Text>

        <TouchableOpacity
          onPress={() => setShowEndPicker(true)}
          className="flex-row items-center bg-[#e6f7f4] rounded-xl px-3 py-4 border border-teal-500"
        >
          <Ionicons
            name="calendar-outline"
            size={20}
            color="#0f766e"
            style={{ marginRight: 8 }}
          />

          <Text className="text-[#0f766e] text-base flex-1">
            {endDate ? endDate.toLocaleDateString() : "Select end date"}
          </Text>
        </TouchableOpacity>

        {showEndPicker && (
          <DateTimePicker
            value={endDate || new Date()}
            mode="date"
            display="spinner"
            onChange={(event, selectedDate) => {
              setShowEndPicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}
      </View>

      {/* mediclinic usage */}
      <View className="mt-4 mb-4">
        <Text className="text-gray-600 text-sm mb-2 font-medium">
          Medicine Usage
        </Text>

        <View className="flex-row items-center">
          <RadioButton
            label="On an empty stomach"
            selected={usage === "empty_stomach"}
            onPress={() => setUsage("empty_stomach")}
          />

          <RadioButton
            label="With food"
            selected={usage === "with_food"}
            onPress={() => setUsage("with_food")}
          />
        </View>
      </View>

      {/* in day time  */}

      <View className="mt-4 mb-4">
        <Text className="text-gray-600 text-sm mb-3 font-medium">
          Medicine Time
        </Text>

        <Checkbox
          label="Morning"
          checked={times.includes("morning")}
          onPress={() => toggleTime("morning")}
        />

        <Checkbox
          label="Noon"
          checked={times.includes("noon")}
          onPress={() => toggleTime("noon")}
        />

        <Checkbox
          label="Evening"
          checked={times.includes("evening")}
          onPress={() => toggleTime("evening")}
        />
      </View>

      <TouchableOpacity
        onPress={handleSaveMedicInfo}
        style={{
          backgroundColor: "#2E7D32", // green
          paddingVertical: 14,
          paddingHorizontal: 24,
          borderRadius: 30,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          marginTop: 20,
        }}
        activeOpacity={0.8}
      >
        <Ionicons
          name="download-outline"
          size={20}
          color="white"
          style={{ marginRight: 8 }}
        />

        <Text
          style={{
            color: "white",
            fontSize: 18,
            fontWeight: "600",
          }}
        >
          Kaydet
        </Text>
      </TouchableOpacity>
    </View>
  );
}

export function DrugInfoView({ response }: { response: string | null }) {
  if (!response) return null;

  const cleaned = cleanGemini(response);

  let json: any = null;
  try {
    json = JSON.parse(cleaned);
  } catch (err) {
    return <Text>Format error</Text>;
  }

  const html = convertJsonToHtml(json);

  return (
    <View style={{ height: 500, marginTop: 16 }}>
      <Text className="text-xl font-bold text-teal-700">Ai explanation</Text>
      <WebView
        originWhitelist={["*"]}
        source={{ html }}
        style={{ flex: 1 }}
        javaScriptEnabled={true}
        // HTML kendi viewport scale’ini kontrol etsin diye:
        scalesPageToFit={false}
        // Android
        setBuiltInZoomControls={true}
        setDisplayZoomControls={false}
        setSupportZoom={true}
        // iOS
        allowsInlineMediaPlayback={true}
        nestedScrollEnabled={true}
      />
    </View>
  );
}

// auxilary

async function fetchDrugInfoFromNetwork(
  medicineName: string,
  signal: AbortSignal
) {
  try {
    const url = `https://us-central1-medilink-dev.cloudfunctions.net/drugInfo?name=${encodeURIComponent(medicineName)}`;

    const response = await fetch(url, { signal });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const text = await response.text(); // Gemini JSON string döner
    return text;
  } catch (err) {
    console.error("Fetch error:", err);
    return null;
  }
}

function convertJsonToHtml(json: any): string {
  let html = "<div style='font-family: sans-serif; line-height: 1.6;'>";

  for (const key in json) {
    const sectionTitle = key
      .replace(/_/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());
    const text = json[key];

    html += `
      <h2 style="color: #0f766e; font-size: 20px; margin-top: 16px;">
        ${sectionTitle}
      </h2>
    `;

    const lines = String(text).split("\n").filter(Boolean);

    html += "<ul>";
    for (const line of lines) {
      const clean = line.replace(/^[*-]\s*/, "");
      html += `<li style="margin-bottom: 8px;">${clean}</li>`;
    }
    html += "</ul>";
  }

  html += "</div>";
  return html;
}

function cleanGemini(raw: string) {
  return raw
    .replace(/```json/gi, "")
    .replace(/```/g, "")
    .trim();
}
