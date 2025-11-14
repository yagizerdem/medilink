import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { useApp } from "../../../Provider/AppProvider";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { Firestore } from "@google-cloud/firestore";
import {
  collection,
  doc,
  getDocs,
  getFirestore,
  query,
  where,
} from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { getAuth } from "firebase/auth";
import Toast from "react-native-toast-message";
import { StockEntity } from "../../../shared/model/entity/StockEntity";
import { PatientEntity } from "../../../shared/model/entity/PatientEntity";

export function Dashboard() {
  const { profile } = useApp();
  const [stock, setStock] = useState<StockEntity[]>([]);
  const cirticalCount =
    stock.filter((medic) => medic.stockAmount <= 50).length || 0;
  const [patientAmount, setPatientsAmount] = useState<number>(0);
  const [showCriticalStock, setShowCriticalStock] = useState<boolean>(false);

  useEffect(() => {
    async function fetchMedicCount() {
      try {
        const auth = getAuth(app);
        const pharmacistUid = auth.currentUser?.uid;
        if (!pharmacistUid) {
          Toast.show({
            type: "error",
            text1: "User not authenticated.",
          });
          return;
        }

        const db = getFirestore(app);
        const colRef = collection(db, "stock");
        const q = query(colRef, where("pharmacistUid", "==", pharmacistUid));
        const snapshot = await getDocs(q);

        const medicines: StockEntity[] = [];
        snapshot.forEach((doc) => {
          medicines.push({ ...(doc.data() as StockEntity), uid: doc.id });
        });
        setStock(medicines);
      } catch (error) {
        console.error("Error fetching medicine count:", error);
      }
    }

    async function getPatientCount() {
      try {
        const auth = getAuth(app);
        const pharmacistUid = auth.currentUser?.uid;
        if (!pharmacistUid) {
          Toast.show({
            type: "error",
            text1: "User not authenticated.",
          });
          return;
        }

        const db = getFirestore(app);
        const colRef = collection(db, "patients");
        const q = query(colRef, where("pharmacistUid", "==", pharmacistUid));
        const snapshot = await getDocs(q);
        const total = snapshot.size;

        setPatientsAmount(total);
      } catch (error) {
        console.error("Error fetching medicine count:", error);
      }
    }

    fetchMedicCount();
    getPatientCount();
  }, []);

  if (showCriticalStock) {
    return (
      <View className="flex-1 px-4 pt-4">
        <View className="flex-row items-center mb-4">
          <TouchableOpacity onPress={() => setShowCriticalStock(false)}>
            <Ionicons name="chevron-back-outline" size={24} color="#0c6ea6" />
          </TouchableOpacity>
          <Text className="text-xl font-semibold text-teal-600 ml-4">
            Critical Stock Levels
          </Text>
        </View>
        <FlatList
          data={stock.filter((medic) => medic.stockAmount <= 50)}
          keyExtractor={(item) => item.uid}
          renderItem={({ item }) => <StockItem item={item} />}
          showsVerticalScrollIndicator={false}
        />
      </View>
    );
  }

  return (
    <View>
      <Text className="text-2xl font-semibold text-teal-600 mx-auto my-4 ">
        Welcome,{" "}
        <Text className="font-bold text-teal-700">
          {profile?.firstName} {profile?.lastName}
        </Text>{" "}
        👋
      </Text>

      <View className="w-full">
        {/* TOTAL MEDICINES CARD */}
        <View className="bg-white rounded-2xl py-4 px-5 flex-row items-center shadow-md my-2">
          {/* Icon Box */}
          <View className="w-10 h-10 rounded-xl bg-[#e0f0f7] mr-4 items-center justify-center">
            <Ionicons name="medkit-outline" size={22} color="#0c6ea6" />
          </View>

          {/* Text */}
          <View className="flex-1">
            <Text className="text-[#1e293b] font-bold text-base">
              Total medicines in inventory
            </Text>
            <Text className="text-[#64748b] text-sm">
              {stock.length} registered medicines
            </Text>
          </View>
        </View>

        {/* CRITICAL STOCK CARD */}
        <TouchableOpacity
          onPress={() => setShowCriticalStock(true)}
          className="bg-white rounded-2xl py-4 px-5 flex-row items-center my-2
                       shadow-[0px_4px_10px_rgba(255,150,150,0.35)]"
        >
          {/* Icon Left */}
          <View className="w-10 h-10 rounded-xl bg-[#ffe6e6] mr-4 items-center justify-center">
            <Ionicons name="warning-outline" size={22} color="#d9534f" />
          </View>

          {/* Text */}
          <View className="flex-1">
            <Text className="text-[#1e293b] font-bold text-base">
              Medicines with critical stock levels
            </Text>
            <Text className="text-[#64748b] text-sm">
              {cirticalCount} medicines have critical stock levels
            </Text>
          </View>

          {/* RIGHT ICON → as requested */}
          <Ionicons
            name="chevron-forward-outline"
            size={22}
            color="#94a3b8"
            style={{ marginLeft: 8 }}
          />
        </TouchableOpacity>

        <View className="bg-white rounded-2xl py-4 px-5 flex-row items-center shadow-md my-2">
          {/* Icon Box */}
          <View className="w-10 h-10 rounded-xl bg-[#ede7f6] mr-4 items-center justify-center">
            <Ionicons name="people-outline" size={22} color="#6a4cbc" />
          </View>

          {/* Text Group */}
          <View className="flex-1">
            <Text className="text-[#1e293b] font-bold text-base">
              Total Patient Count
            </Text>

            <Text className="text-[#64748b] text-sm">
              {patientAmount} patients assigned to you
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}

interface StockItemProps {
  item: StockEntity;
}

export function StockItem({ item }: StockItemProps) {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-2xl px-4 py-3 mb-3 shadow-md">
      {/* Left Icon */}
      <View className="w-10 h-10 rounded-xl bg-orange-100 justify-center items-center">
        <Ionicons name="warning-outline" size={22} color="#f97316" />
      </View>

      {/* Center Text */}
      <View className="flex-1 px-4">
        <Text className="text-gray-800 font-semibold text-base">
          {item.medicineName}
        </Text>
      </View>

      {/* Right stock badge */}
      <View className="bg-orange-100 px-3 py-1 rounded-xl">
        <Text className="text-orange-600 font-semibold text-sm">
          {item.stockAmount} kutu
        </Text>
      </View>
    </View>
  );
}
