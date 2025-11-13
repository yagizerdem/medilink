import { View, Text, TextInput, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Fragment, useEffect, useRef, useState } from "react";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { useApp } from "../../../Provider/AppProvider";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { FirebaseError } from "firebase/app";
import { isOperationalError } from "../../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import Toast from "react-native-toast-message";
import { StockEntity } from "../../../shared/model/entity/StockEntity";
import { generatePushID } from "../../../util/generatePushID";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { app } from "../../../firebaseConfig";
import { useStock } from "../../../Provider/StockProvider";
import { useDebounce } from "../../../hooks/useDebounce";

export function Stock() {
  const addMedicineSheetRef = useRef<BottomSheet>(null);
  const { setIsLoading } = useApp();
  const {
    setStock,
    selectedStockEntity,
    setSelectedStockEntity,
    stockFilter,
    setStockFilter,
  } = useStock();

  useEffect(() => {
    fetchStockData();

    async function fetchStockData() {
      try {
        setIsLoading(true);

        const pharmacistUid = getAuth(app).currentUser?.uid;
        if (!pharmacistUid) {
          Toast.show({
            type: "error",
            text1: "User not authenticated. Please log in again.",
          });
          return;
        }

        const db = getFirestore(app);
        const patientsQuery = query(
          collection(db, "stock"),
          where("pharmacistUid", "==", pharmacistUid)
        );
        const querySnapshot = await getDocs(patientsQuery);

        const stockList: StockEntity[] = [];

        querySnapshot.forEach((doc) => {
          const stockData = doc.data() as StockEntity;
          stockList.push(stockData);
        });
        setStock(stockList);
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
  }, []);

  const openAddMedicineSheet = () => addMedicineSheetRef.current?.expand();

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 bg-teal-50 px-5 pt-6">
        <Text className="text-2xl font-semibold text-teal-700 text-center mb-6">
          Stock Screen
        </Text>

        <View className="w-full bg-white border border-gray-200 rounded-full px-4 py-2 flex-row items-center">
          <Ionicons name="search" size={20} color="#6b7280" />

          <TextInput
            placeholder="Search for medicines ..."
            placeholderTextColor="#9ca3af"
            className="flex-1 ml-2 text-gray-800 text-base"
            onChangeText={(text) => setStockFilter(text)}
            value={stockFilter}
          />
        </View>

        <View className="flex flex-1 ">
          <StockList />
        </View>

        <View className="w-full flex-row justify-end mb-10 mt-4">
          <TouchableOpacity
            onPress={openAddMedicineSheet}
            className="flex flex-row items-center bg-blue-500 py-3 px-4 rounded-lg w-1/2"
          >
            <Ionicons
              name="add"
              size={22}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">
              Add Medicine
            </Text>
          </TouchableOpacity>
        </View>
      </View>
      <BottomSheet
        ref={addMedicineSheetRef}
        index={-1}
        snapPoints={["100%", "20%"]}
        backgroundStyle={{
          backgroundColor: "black",
          opacity: 0.9,
        }}
        enablePanDownToClose={true}
      >
        <BottomSheetScrollView
          contentContainerStyle={{
            paddingHorizontal: 20,
            paddingVertical: 10,
          }}
        >
          <AddMedicineForm />
        </BottomSheetScrollView>
      </BottomSheet>

      {selectedStockEntity && (
        <View className="absolute inset-0 px-6 justify-center items-center">
          {/* Dimmed Background */}
          <TouchableOpacity
            className="absolute inset-0 bg-black/50"
            activeOpacity={1}
            onPress={() => setSelectedStockEntity(null)}
          />

          {/* Modal Card */}
          <View
            className="w-full rounded-3xl bg-white p-7"
            style={{
              shadowColor: "#000",
              shadowOpacity: 0.2,
              shadowRadius: 18,
              shadowOffset: { width: 0, height: 8 },
              elevation: 12,
              transform: [{ translateY: -10 }],
            }}
          >
            {/* Header */}
            <View className="flex-row items-center mb-6">
              <View className="w-14 h-14 rounded-2xl bg-teal-600 justify-center items-center mr-4">
                <Ionicons name="medkit-outline" size={30} color="white" />
              </View>

              <View className="flex-1">
                <Text className="text-2xl font-bold text-gray-900 leading-7">
                  {selectedStockEntity.medicineName}
                </Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Barcode: {selectedStockEntity.barcode}
                </Text>
              </View>
            </View>

            {/* Info Rows */}
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-gray-600 font-semibold">Dosage</Text>
                <Text className="text-gray-800">
                  {selectedStockEntity.dosage}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600 font-semibold">Form</Text>
                <Text className="text-gray-800">
                  {selectedStockEntity.formType}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600 font-semibold">Frequency</Text>
                <Text className="text-gray-800">
                  {selectedStockEntity.frequency}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600 font-semibold">Start Date</Text>
                <Text className="text-gray-800">
                  {selectedStockEntity.startDate}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-gray-600 font-semibold">End Date</Text>
                <Text className="text-gray-800">
                  {selectedStockEntity.endDate}
                </Text>
              </View>

              <View className="flex-row justify-between mt-2">
                <Text className="text-gray-700 font-semibold text-lg">
                  Stock
                </Text>
                <Text className="text-teal-700 font-bold text-lg">
                  {selectedStockEntity.stockAmount} units
                </Text>
              </View>
            </View>

            {/* Close Button */}
            <TouchableOpacity
              onPress={() => setSelectedStockEntity(null)}
              className="mt-8 bg-teal-600 py-4 rounded-2xl"
              style={{
                shadowColor: "#0f766e",
                shadowOpacity: 0.25,
                shadowRadius: 8,
                shadowOffset: { width: 0, height: 4 },
                elevation: 5,
              }}
            >
              <Text className="text-white text-center font-bold text-lg">
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </GestureHandlerRootView>
  );
}

function AddMedicineForm() {
  const [barcode, setBarcode] = useState("");
  const [medicineName, setMedicineName] = useState("");
  const [dosage, setDosage] = useState("");
  const [formType, setFormType] = useState("");
  const [frequency, setFrequency] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [stockAmount, setStockAmount] = useState<number>(0);
  const { setIsLoading } = useApp();
  const { setStock } = useStock();

  async function handleAddMedicine() {
    try {
      setIsLoading(true);

      const pharmacistUid = getAuth(app).currentUser?.uid;

      if (!pharmacistUid) {
        Toast.show({
          type: "error",
          text1: "User not authenticated. Please log in again.",
        });

        return;
      }
      const uid = generatePushID();

      const payload = {
        barcode,
        medicineName,
        dosage,
        formType,
        frequency,
        startDate,
        endDate,
        pharmacistUid,
        uid,
        stockAmount,
      } as StockEntity;

      const db = getFirestore(app);
      await setDoc(doc(db, "stock", uid), payload);

      setStock((prevStock) => [...prevStock, payload]);

      Toast.show({
        type: "success",
        text1: "Medicine added successfully!",
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
  }

  return (
    <BottomSheetScrollView className="flex-1  bg-white p-5 rounded-xl">
      <Text className="text-3xl font-bold text-teal-700 text-center mt-2 mb-8">
        Add New Medicines
      </Text>

      <Text className="text-gray-600 font-semibold tracking-wide mb-2 ml-1">
        Basic Information
      </Text>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-5 shadow-sm">
        <Ionicons name="barcode-outline" size={24} color="#0f766e" />
        <TextInput
          value={barcode}
          onChangeText={setBarcode}
          placeholder="Barcode number"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
          keyboardType="numeric"
        />
      </View>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-5 shadow-sm">
        <Ionicons name="medkit-outline" size={24} color="#0f766e" />
        <TextInput
          value={medicineName}
          onChangeText={setMedicineName}
          placeholder="Medicine name"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
        />
      </View>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-5 shadow-sm">
        <Ionicons name="flask-outline" size={24} color="#0f766e" />
        <TextInput
          value={dosage}
          onChangeText={setDosage}
          placeholder="Dosage (e.g. 500 mg)"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
        />
      </View>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-5 shadow-sm">
        <Ionicons name="cube-outline" size={24} color="#0f766e" />
        <TextInput
          value={formType}
          onChangeText={setFormType}
          placeholder="Form (Tablet, Capsule, Syrup)"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
        />
      </View>

      <Text className="text-gray-600 font-semibold tracking-wide mb-2 ml-1 mt-4">
        Usage Details
      </Text>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-5 shadow-sm">
        <Ionicons name="time-outline" size={24} color="#0f766e" />
        <TextInput
          value={frequency}
          onChangeText={setFrequency}
          placeholder="Frequency (e.g. 2 times/day)"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
        />
      </View>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-5 shadow-sm">
        <Ionicons name="calendar-outline" size={24} color="#0f766e" />
        <TextInput
          value={startDate}
          onChangeText={setStartDate}
          placeholder="Start date"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
        />
      </View>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-10 shadow-sm">
        <Ionicons name="calendar-outline" size={24} color="#0f766e" />
        <TextInput
          value={endDate}
          onChangeText={setEndDate}
          placeholder="End date"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
        />
      </View>

      <View className="w-full bg-white border border-gray-300 rounded-2xl px-5 py-4 flex-row items-center mb-10 shadow-sm">
        <Ionicons name="cube-outline" size={24} color="#0f766e" />

        <TextInput
          value={stockAmount.toString()}
          onChangeText={(v) => {
            const numeric = v.replace(/[^0-9]/g, "");
            setStockAmount(Number(numeric));
          }}
          placeholder="Stock amount"
          placeholderTextColor="#9ca3af"
          className="flex-1 ml-4 text-gray-800 text-lg"
          keyboardType="numeric"
          maxLength={6}
        />
      </View>

      <TouchableOpacity
        className="w-full bg-blue-500 py-4 rounded-2xl mb-10 shadow-lg"
        onPress={() => handleAddMedicine()}
      >
        <Text className="text-white font-bold text-center text-lg">
          Save Medicine
        </Text>
      </TouchableOpacity>
    </BottomSheetScrollView>
  );
}

function StockList() {
  const { stock, setStock, setSelectedStockEntity, stockFilter } = useStock();
  const { setIsLoading, isLoading } = useApp();
  const debouncedFilter = useDebounce(stockFilter, 300);

  const deleteItem = async (uid: string) => {
    try {
      setIsLoading(true);

      const db = getFirestore(app);
      await deleteDoc(doc(db, "stock", uid));

      Toast.show({
        type: "success",
        text1: "Medicine deleted successfully!",
      });

      setStock(stock.filter((item) => item.uid !== uid));
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

    setStock(stock.filter((item) => item.uid !== uid));
  };

  const renderItem = ({ item }: any) => {
    if (
      !item.medicineName.toLowerCase().includes(debouncedFilter.toLowerCase())
    ) {
      return null;
    }

    return (
      <TouchableOpacity
        className="w-full bg-white rounded-2xl px-4 py-4 mb-4 flex-row items-center shadow-sm"
        style={{
          shadowColor: "#000",
          shadowOpacity: 0.12,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 4 },
          elevation: 4,
        }}
        onPress={() =>
          setSelectedStockEntity(stock.find((x) => x.uid === item.uid) || null)
        }
        activeOpacity={0.9}
      >
        {/* Left Icon */}
        <View className="w-12 h-12 rounded-xl bg-teal-600 justify-center items-center mr-4">
          <Ionicons name="medkit-outline" size={26} color="white" />
        </View>

        {/* Text Content */}
        <View className="flex-1 pr-4">
          <Text
            numberOfLines={2}
            className="text-gray-800 font-semibold text-base leading-5"
          >
            {item.medicineName}
          </Text>

          <Text className="text-gray-500 text-sm mt-1">
            Stok: {item.stockAmount} kutu
          </Text>
        </View>

        {/* Delete Button */}
        <TouchableOpacity onPress={() => deleteItem(item.uid)}>
          <Ionicons name="trash-outline" size={24} color="#dc2626" />
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  return (
    <Fragment>
      <FlatList
        data={stock}
        keyExtractor={(item) => item.uid}
        renderItem={renderItem}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingVertical: 10 }}
      />
    </Fragment>
  );
}
