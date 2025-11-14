import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import { MedicineInfo } from "../../../shared/model/entity/MedicineInfo";
import { useApp } from "../../../Provider/AppProvider";
import {
  collection,
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

export function MyMedicines() {
  const [medicines, setMedicines] = useState<MedicineInfo[]>([]);
  const { setIsLoading } = useApp();

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

  return (
    <View className="flex-1 bg-teal-50 p-4">
      <ScrollView showsVerticalScrollIndicator={false}>
        {medicines.map((item, index) => (
          <MedicineCard key={item.uid} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

function MedicineCard({ item }: { item: MedicineInfo }) {
  return (
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
          Başlangıç: {new Date(item.startDate).toLocaleDateString()}
        </Text>
        <Text className="text-gray-600 text-sm">
          Bitiş: {new Date(item.endDate).toLocaleDateString()}
        </Text>
      </View>

      {/* Right side buttons */}
      <View className="flex-row items-center">
        <TouchableOpacity className="mr-2">
          <Ionicons name="arrow-forward-circle" size={24} color="#16a34a" />
        </TouchableOpacity>

        <TouchableOpacity>
          <Ionicons name="trash" size={24} color="#dc2626" />
        </TouchableOpacity>
      </View>
    </View>
  );
}
