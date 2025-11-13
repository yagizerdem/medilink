import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useRef, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { Gender } from "../../../enums/gender";
import { generatePushID } from "../../../util/generatePushID";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  getFirestore,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { app } from "../../../firebaseConfig";
import { useApp } from "../../../Provider/AppProvider";
import Toast from "react-native-toast-message";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { isOperationalError } from "../../../util/isOperationalError";
import { FirebaseError } from "firebase/app";
import { CreatePatientDto } from "../../../shared/model/dto/CreatePatientDto";
import { getAuth } from "firebase/auth";
import { validateEmail } from "../../../util/validateEmail";
import { PatientEntity } from "../../../shared/model/entity/PatientEntity";
import { PatientsList } from "../Components/PatientsList";
import { usePatients } from "../../../Provider/PatientsContext";

export function Patients() {
  const addClientSheetRef = useRef<BottomSheet>(null);
  const { patients, setPatients } = usePatients();
  const { setIsLoading } = useApp();

  const openAddClientSheet = () => addClientSheetRef.current?.expand();
  const closeAddClientSheet = () => addClientSheetRef.current?.close();

  useEffect(() => {
    fetchPatients();

    async function fetchPatients() {
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
          collection(db, "patients"),
          where("pharmacistUid", "==", pharmacistUid)
        );
        const querySnapshot = await getDocs(patientsQuery);
        const patientsList: PatientEntity[] = [];
        querySnapshot.forEach((doc) => {
          patientsList.push(doc.data() as PatientEntity);
        });
        setPatients(patientsList);
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

  function onSelectPatient(patient: PatientEntity) {
    // Handle patient selection (e.g., navigate to patient details)
    console.log("Selected patient:", patient);
  }

  return (
    <GestureHandlerRootView className="flex-1">
      <View className="flex-1 flex-col bg-teal-50 px-5 pt-6">
        <View className="flex-1 mb-4">
          <PatientsList patients={patients} onPressPatient={onSelectPatient} />
        </View>

        <View className="w-full flex-row justify-end mb-6">
          <TouchableOpacity
            onPress={openAddClientSheet}
            className="flex flex-row items-center bg-blue-500 py-3 px-4 rounded-lg w-1/2"
          >
            <Ionicons
              name="add"
              size={22}
              color="white"
              style={{ marginRight: 8 }}
            />
            <Text className="text-white font-semibold text-lg">
              Add Patient
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <BottomSheet
        ref={addClientSheetRef}
        index={-1}
        snapPoints={["100%", "20%"]}
        backgroundStyle={{ backgroundColor: "transparent" }}
        enablePanDownToClose={true}
      >
        <BottomSheetView className="w-full h-full">
          <View className="flex-1 mx-5 bg-white rounded-t-2xl p-5 shadow-lg">
            <AddPatientForm />
          </View>
        </BottomSheetView>
      </BottomSheet>
    </GestureHandlerRootView>
  );
}

export function AddPatientForm() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState<Gender | null>(null);
  const [age, setAge] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const { setIsLoading } = useApp();
  const { patients, setPatients } = usePatients();

  const handleSubmit = async () => {
    try {
      const pharmacistUid = getAuth(app).currentUser?.uid;

      if (!pharmacistUid) {
        Toast.show({
          type: "error",
          text1: "User not authenticated. Please log in again.",
        });

        return;
      }

      if (firstName.trim().length < 2 || lastName.trim().length < 2) {
        Toast.show({
          type: "error",
          text1: "First and last names must be at least 2 characters long.",
        });
        return;
      }

      if (!validateEmail(email)) {
        Toast.show({
          type: "error",
          text1: "Please enter a valid email address.",
        });
        return;
      }

      setIsLoading(true);
      const payload = {
        firstName,
        lastName,
        email,
        gender,
        age: Number(age),
        uid: generatePushID(),
        pharmacistUid: pharmacistUid,
        phoneNumber,
      } as CreatePatientDto;

      const uid = generatePushID();

      const db = getFirestore(app);
      await setDoc(doc(db, "patients", uid), payload);

      setPatients([...patients, payload as PatientEntity]);

      Toast.show({
        type: "success",
        text1: "Patient added successfully!",
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
  };

  return (
    <ScrollView className="flex-1">
      <Text className="text-xl font-semibold text-teal-700 mb-4">
        Add Patient
      </Text>

      {/* First Name */}
      <View className="mb-3">
        <Text className="text-sm text-slate-500 mb-1">First Name</Text>
        <TextInput
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter first name"
          className="bg-teal-50 rounded-lg px-3 py-2 text-base text-slate-800"
        />
      </View>

      {/* Last Name */}
      <View className="mb-3">
        <Text className="text-sm text-slate-500 mb-1">Last Name</Text>
        <TextInput
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter last name"
          className="bg-teal-50 rounded-lg px-3 py-2 text-base text-slate-800"
        />
      </View>

      {/* Email */}
      <View className="mb-3">
        <Text className="text-sm text-slate-500 mb-1">Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          keyboardType="email-address"
          autoCapitalize="none"
          className="bg-teal-50 rounded-lg px-3 py-2 text-base text-slate-800"
        />
      </View>

      {/* Phone */}
      <View className="mb-3">
        <Text className="text-sm text-slate-500 mb-1">Phone</Text>
        <TextInput
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          autoCapitalize="none"
          className="bg-teal-50 rounded-lg px-3 py-2 text-base text-slate-800"
        />
      </View>

      {/* Gender */}
      <View className="mb-3">
        <Text className="text-sm text-slate-500 mb-2">Gender</Text>
        <View className="flex-row gap-2">
          {(
            [
              { key: Gender.male, label: "Male" },
              { key: Gender.female, label: "Female" },
            ] as const
          ).map((g) => (
            <TouchableOpacity
              key={g.key}
              onPress={() => setGender(g.key)}
              className={`px-3 py-2 rounded-full border ${
                gender === g.key
                  ? "bg-teal-600 border-teal-600"
                  : "bg-white border-slate-300"
              }`}
            >
              <Text
                className={`text-sm ${
                  gender === g.key ? "text-white" : "text-slate-700"
                }`}
              >
                {g.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Age */}
      <View className="mb-4">
        <Text className="text-sm text-slate-500 mb-1">Age</Text>
        <TextInput
          value={age}
          onChangeText={setAge}
          placeholder="Enter age"
          keyboardType="number-pad"
          className="bg-teal-50 rounded-lg px-3 py-2 text-base text-slate-800"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        onPress={handleSubmit}
        className="mt-2 bg-teal-600 py-3 rounded-xl items-center"
      >
        <Text className="text-white font-semibold text-base">Save Patient</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}
