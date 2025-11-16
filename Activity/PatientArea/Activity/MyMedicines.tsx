import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import { useState, useEffect, Fragment, useRef } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MedicineInfo } from "../../../shared/model/entity/MedicineInfo";
import { useApp } from "../../../Provider/AppProvider";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";
import { isOperationalError } from "../../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { app } from "../../../firebaseConfig";
import WebView from "react-native-webview";

export function MyMedicines() {
  const [medicines, setMedicines] = useState<MedicineInfo[]>([]);
  const { setIsLoading } = useApp();
  const [showDrugInteractionPopup, setShowDrugInteractionPopup] =
    useState(false);

  const [drugInteraction, setDrugInteraction] = useState<string>("");

  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    fetchMedicines();

    async function fetchMedicines() {
      try {
        setIsLoading(true);

        const db = getFirestore(app);
        const auth = getAuth(app);

        if (!auth.currentUser?.email) {
          Toast.show({
            type: "error",
            text1: "User not authenticated.",
          });
          return;
        }

        const colRef = collection(db, "medicineInfos");
        const q = query(colRef, where("email", "==", auth.currentUser.email));
        const snapshot = await getDocs(q);

        const list: MedicineInfo[] = [];
        snapshot.forEach((doc) => list.push(doc.data() as MedicineInfo));

        setMedicines(list);
      } catch (error) {
        console.error("Error:", error);
        if (error instanceof FirebaseError && isOperationalError(error)) {
          Toast.show({ type: "error", text1: getFriendlyAuthMessage(error) });
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
  }, []);

  async function onDeleteMedicine(item: MedicineInfo) {
    try {
      setIsLoading(true);

      const db = getFirestore(app);

      const docRef = collection(db, "medicineInfos");
      await deleteDoc(doc(docRef, item.uid));

      setMedicines((prev) => prev.filter((med) => med.uid !== item.uid));
      Toast.show({
        type: "success",
        text1: "Medicine deleted successfully.",
      });
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

    console.log(item);
  }

  async function handleOnDrugInteraction() {
    try {
      setIsLoading(true);

      setShowDrugInteractionPopup(true);

      const drugNames = medicines.map((med) => med.medicineName);

      const controller = new AbortController();
      abortControllerRef.current = controller;

      const url =
        "https://us-central1-medilink-dev.cloudfunctions.net/api/drug-interactions";

      const response = await fetch(url, {
        method: "POST",
        signal: controller.signal,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ drugs: drugNames }),
      });

      console.log("API response : ", response);

      if (!response.ok) {
        throw new Error("API returned an error");
      }

      // Gemini’dan dönen TEXT JSON formatında
      const resultText = await response.text();

      // Gemini bazen JSON’ı text olarak döner → parse et
      const resultJson = JSON.parse(resultText);

      // Popup veya modal için sonucu state’e koy
      setDrugInteraction(resultJson);
    } catch (error) {
      console.error("Drug interaction fetch error: ", error);

      Toast.show({
        type: "error",
        text1: "Drug interaction check failed",
        text2: "Please try again.",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (!showDrugInteractionPopup) {
      setDrugInteraction("");
    }
  }, [showDrugInteractionPopup]);

  return (
    <View className="flex-1 bg-teal-50 p-4">
      <Modal
        visible={showDrugInteractionPopup}
        transparent
        animationType="fade"
      >
        <View className="flex-1 bg-black/50 justify-center items-center px-4">
          <View className="w-full max-w-md bg-white rounded-2xl p-5 shadow-xl">
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-xl font-bold text-gray-900">
                Drug Interactions
              </Text>

              <TouchableOpacity
                onPress={() => {
                  abortControllerRef.current?.abort();
                  setShowDrugInteractionPopup(false);
                }}
              >
                <Ionicons name="close" size={26} color="#555" />
              </TouchableOpacity>
            </View>

            <Text className="text-gray-600 mb-4 text-sm">
              Possible interactions between the patient’s medications:
            </Text>

            <ScrollView
              showsVerticalScrollIndicator={false}
              className="max-h-[350px]"
            >
              {!drugInteraction && (
                <Text className="text-gray-500 text-center py-6">
                  Loading interaction data...
                </Text>
              )}

              {drugInteraction && (
                <WebView
                  originWhitelist={["*"]}
                  source={{ html: drugInteractionToHtml(drugInteraction) }}
                  style={{ height: 350, width: "100%" }}
                  javaScriptEnabled
                  scalesPageToFit={false}
                  nestedScrollEnabled
                />
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>

      <View className="w-full h-fit  flex items-end">
        <TouchableOpacity
          onPress={handleOnDrugInteraction}
          activeOpacity={0.85}
          className="
    w-1/2
    flex-row 
    items-center 
    justify-center 
    bg-blue-600 
    py-3
    rounded-2xl 
    mb-6 
    shadow-md 
    shadow-blue-700/30
  "
        >
          <Ionicons
            name="git-compare-outline"
            size={22}
            color="white"
            style={{ marginRight: 10 }}
          />

          <Text className="text-white text-lg font-semibold tracking-wide">
            Drug Interaction
          </Text>
        </TouchableOpacity>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        {medicines.map((item, index) => (
          <MedicineCard
            key={item.uid}
            item={item}
            onDeleteMedicine={onDeleteMedicine}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function MedicineCard({
  item,
  onDeleteMedicine,
}: {
  item: MedicineInfo;
  onDeleteMedicine: (item: MedicineInfo) => void;
}) {
  const [showDeletePopup, setShowDeletePopup] = useState(false);

  function onDeleteMedicineHandler() {
    setShowDeletePopup(false);
    onDeleteMedicine(item);
  }

  return (
    <Fragment>
      <Modal visible={showDeletePopup} transparent={true} animationType="fade">
        <TouchableOpacity
          className="flex-1 bg-black/40 justify-center items-center"
          onPress={() => setShowDeletePopup(false)}
        >
          <View className="bg-white w-80 rounded-2xl p-5 shadow-lg">
            <Text className="text-lg font-bold text-gray-800 mb-3">
              Delete Medicine
            </Text>

            <Text className="text-gray-600 mb-5">
              Are you sure you want to delete{" "}
              <Text className="font-semibold">{item.medicineName}</Text>?
            </Text>

            <View className="flex-row justify-end">
              {/* Cancel */}
              <TouchableOpacity
                onPress={() => setShowDeletePopup(false)}
                className="px-4 py-2 mr-3"
              >
                <Text className="text-gray-600 font-semibold">Cancel</Text>
              </TouchableOpacity>

              {/* Delete */}
              <TouchableOpacity
                onPress={onDeleteMedicineHandler}
                className="bg-red-600 px-4 py-2 rounded-lg"
              >
                <Text className="text-white font-semibold">Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Modal>

      <View
        className="
        bg-white 
        rounded-2xl 
        p-4 
        flex-row 
        items-center 
        mb-4
      "
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.1,
          shadowRadius: 6,
          elevation: 4,
        }}
      >
        {/* Icon */}
        <View className="w-12 h-12 bg-teal-100 rounded-xl items-center justify-center mr-4">
          <Ionicons name="medkit-outline" size={26} color="#0f766e" />
        </View>

        {/* Text content */}
        <View className="flex-1">
          <Text
            className="font-bold text-[#0f766e] text-base mb-1"
            style={{ textTransform: "uppercase" }}
          >
            {item.medicineName}
          </Text>

          <Text className="text-gray-600 text-sm">
            Start date: {new Date(item.startDate).toLocaleDateString()}
          </Text>
          <Text className="text-gray-600 text-sm">
            End date: {new Date(item.endDate).toLocaleDateString()}
          </Text>
        </View>

        {/* Right side buttons */}
        <View className="flex-row items-center">
          <TouchableOpacity className="mr-2">
            <Ionicons name="arrow-forward-circle" size={24} color="#16a34a" />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => setShowDeletePopup(true)}>
            <Ionicons name="trash" size={24} color="#dc2626" />
          </TouchableOpacity>
        </View>
      </View>
    </Fragment>
  );
}

function drugInteractionToHtml(data: any): string {
  if (!data) {
    return "<p>Loading...</p>";
  }

  // Single drug mode
  if (data.drug) {
    return `
      <div style="font-family: sans-serif; padding: 8px;">
        <h2 style="margin: 0 0 10px;">${data.drug}</h2>
        <p><b>Uses:</b> ${data.uses}</p>
        <p><b>Side Effects:</b> ${data.side_effects}</p>
        <p><b>Contraindications:</b> ${data.contraindications}</p>
        <p><b>Warnings:</b> ${data.warnings}</p>
        <p><b>Interactions:</b> ${data.interactions}</p>
      </div>
    `;
  }

  // Multi drug mode
  const pairsHtml = data.critical_pairs
    .map(
      (p) => `
      <div style="margin-bottom: 12px; padding: 10px; border-radius: 8px; background:#f7f7f7;">
        <h3 style="margin:0 0 6px;">${p.drugA} × ${p.drugB}</h3>
        <p><b>Risk:</b> ${p.risk}</p>
        <p><b>Note:</b> ${p.note}</p>
      </div>
    `
    )
    .join("");

  return `
    <div style="font-family: sans-serif; padding: 8px;">
      <h2>${data.summary}</h2>
      ${pairsHtml}
      <p style="color:#555;">Skipped: ${data.skipped_count}</p>
    </div>
  `;
}
