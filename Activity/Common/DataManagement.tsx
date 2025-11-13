import { View, Text, ScrollView, Switch, TouchableOpacity } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useState } from "react";
import { useDataPermissions } from "../../Provider/DataPermissionsProvider";
import { useDebounce } from "../../hooks/useDebounce";
import { useApp } from "../../Provider/AppProvider";
import {
  deleteDoc,
  doc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { app } from "../../firebaseConfig";
import { DataPermissionsEntity } from "../../shared/model/entity/DataPermissionsEntity";
import Toast from "react-native-toast-message";
import { useNavigation } from "@react-navigation/native";
import { ConfirmDeleteModal } from "../../Components/ConfirmDeleteModal";
import { deleteUser, getAuth } from "firebase/auth";
import { FirebaseError } from "firebase/app";
import { isOperationalError } from "../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../util/getFriendlyMessage";

export function DataManagement() {
  const { dataPermissions, setDataPermissions, isLoading } =
    useDataPermissions();
  const { profile, setIsLoading, setProfile } = useApp();
  const navigation = useNavigation();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const debouncedDataPermissions = useDebounce(dataPermissions, 300);

  async function updateDataPermissions(
    updates: Partial<typeof dataPermissions>
  ) {
    if (!dataPermissions) return;

    const newPermissions = {
      ...dataPermissions,
      ...updates,
    };
    setDataPermissions(newPermissions);
  }

  useEffect(() => {
    updateDataPermission();
    async function updateDataPermission() {
      try {
        if (profile && profile.uid) {
          const db = getFirestore(app);

          await setDoc(
            doc(db, "dataPermissions", profile.uid),
            {
              allowAnonymousAnalytics:
                dataPermissions?.allowAnonymousAnalytics ?? false,
              kvkkApproved: dataPermissions?.kvkkApproved ?? false,
            } as DataPermissionsEntity,
            { merge: true }
          );
        }
      } catch (error) {
        console.log(error);
        Toast.show({
          text1: "Failed to update data permissions.",
          type: "error",
        });
      }
    }
  }, [debouncedDataPermissions]);

  function goBack() {
    //@ts-ignore
    navigation.navigate("PharmacistApp" as never, { screen: "Settings" });
  }

  async function deleteAccount() {
    try {
      setIsLoading(true);
      const auth = getAuth(app);
      const uid: string | undefined = auth.currentUser?.uid;
      if (!uid) {
        Toast.show({
          text1: "No user is currently logged in.",
          type: "error",
        });
        return;
      }

      const db = getFirestore(app);

      await deleteDoc(doc(db, "dataPermissions", uid));
      await deleteDoc(doc(db, "profile", uid));
      await deleteUser(auth.currentUser!);
      setProfile(null);
      setDataPermissions({
        allowAnonymousAnalytics: false,
        kvkkApproved: false,
      });

      navigation.navigate("Gate" as never);
    } catch (error) {
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
      setShowDeleteModal(false);
    }
  }

  return (
    <View className="flex-1 bg-teal-50 px-5 pt-6">
      {/* Header */}
      <View className="flex flex-row items-center  h-12 ">
        <TouchableOpacity className="w-12 " onPress={() => goBack()}>
          <Ionicons name="arrow-back" size={24} color="#0f766e" />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-teal-700 text-center  flex items-center ">
          Data Management
        </Text>
      </View>
      <ScrollView showsVerticalScrollIndicator={false}>
        <SectionHeader title="Personal Data" icon="person-circle-outline" />

        <Card
          title="Collected Data"
          description="Name, email, and profile photo are stored securely on Firebase."
        />

        <Card
          title="Usage Purposes"
          description="Personalization, sending notifications, and improving user experience."
        />

        <SectionHeader
          title="App Permissions"
          icon="shield-checkmark-outline"
        />

        <Card title="Camera" description="Used to scan medicine barcodes." />
        <Card
          title="Notifications"
          description="Used to receive timely medicine reminders."
        />
        <Card
          title="Storage"
          description="Required to upload your profile photo from the gallery."
        />

        <SectionHeader title="Data Controls" icon="warning-outline" />

        <TouchableOpacity
          className="bg-red-50 border border-red-300 rounded-2xl p-4 mb-4"
          onPress={() => setShowDeleteModal(true)}
        >
          <Text className="text-red-700 font-semibold text-base">
            Delete Account
          </Text>
          <Text className="text-red-600 text-xs mt-1">
            Permanently delete your account and all stored data.
          </Text>
        </TouchableOpacity>

        <View className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <Text className="text-teal-700 font-semibold text-base">
            Data Download
          </Text>
          <Text className="text-gray-600 text-xs mt-1 leading-4">
            Coming soon. You will be able to download your data and review it.
          </Text>
        </View>

        <SectionHeader title="Data Permissions" icon="bar-chart-outline" />

        <View className="bg-white rounded-2xl p-4 shadow-md mb-4">
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-teal-700 font-semibold text-base">
                Allow Anonymous Analytics
              </Text>
              <Text className="text-gray-600 text-xs mt-1 leading-4 w-56">
                When enabled, anonymous usage analytics helps improve the app
                experience.
              </Text>
            </View>

            <Switch
              value={dataPermissions?.allowAnonymousAnalytics}
              onValueChange={() =>
                updateDataPermissions({
                  allowAnonymousAnalytics:
                    !dataPermissions?.allowAnonymousAnalytics,
                  kvkkApproved: dataPermissions?.kvkkApproved,
                })
              }
              trackColor={{ false: "#ccc", true: "#0f766e" }}
              thumbColor={
                dataPermissions?.allowAnonymousAnalytics ? "#ffffff" : "#f4f4f4"
              }
            />
          </View>
        </View>

        <TouchableOpacity
          onPress={() =>
            updateDataPermissions({
              kvkkApproved: !dataPermissions?.kvkkApproved,
              allowAnonymousAnalytics: dataPermissions?.allowAnonymousAnalytics,
            })
          }
          className="flex-row items-start bg-white rounded-2xl p-4 shadow-md mb-4"
        >
          <View
            className={`w-5 h-5 rounded flex items-center justify-center border ${
              dataPermissions?.kvkkApproved
                ? "bg-teal-600 border-teal-600"
                : "border-gray-400"
            }`}
          >
            {dataPermissions?.kvkkApproved && (
              <Ionicons name="checkmark" size={14} color="white" />
            )}
          </View>

          <View className="ml-3 flex-1">
            <Text className="text-teal-700 font-semibold text-base">
              I approve the processing of my personal data under KVKK.
            </Text>
          </View>
        </TouchableOpacity>

        {/* KVKK Explanation */}
        <Text className="text-gray-600 text-xs mb-10 leading-4">
          Personal data is processed in accordance with KVKK and relevant
          regulations.
        </Text>
      </ScrollView>

      <ConfirmDeleteModal
        visible={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={deleteAccount}
      />
    </View>
  );
}

function SectionHeader({ title, icon }: { title: string; icon: any }) {
  return (
    <View className="flex-row items-center mt-4 mb-2">
      <Ionicons name={icon} size={20} color="#0f766e" />
      <Text className="text-teal-700 font-semibold text-lg ml-2">{title}</Text>
    </View>
  );
}

function Card({ title, description }: { title: string; description: string }) {
  return (
    <View className="bg-white rounded-2xl p-4 shadow-md mb-4">
      <Text className="text-teal-700 font-semibold text-base">{title}</Text>
      <Text className="text-gray-600 text-xs mt-1 leading-4">
        {description}
      </Text>
    </View>
  );
}
