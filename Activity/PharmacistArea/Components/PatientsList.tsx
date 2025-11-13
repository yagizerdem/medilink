import React from "react";
import { View, Text, TouchableOpacity, FlatList } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { PatientEntity } from "../../../shared/model/entity/PatientEntity";

interface PatientListItemProps {
  patient: PatientEntity;
  onPress: () => void;
}

interface PatientsListProps {
  patients: PatientEntity[];
  onPressPatient: (patient: PatientEntity) => void;
}

function PatientListItem({ patient, onPress }: PatientListItemProps) {
  return (
    <TouchableOpacity
      className="bg-white p-4 rounded-2xl mb-3 flex-row items-center shadow-sm"
      onPress={onPress}
    >
      <View className="w-12 h-12 bg-teal-600 rounded-full justify-center items-center mr-3">
        <Ionicons name="person" color="white" size={24} />
      </View>

      <View className="flex-1">
        <Text className="text-lg font-semibold text-gray-800">
          {patient.firstName} {patient.lastName}
        </Text>
        <Text className="text-gray-500">{patient.email}</Text>
      </View>

      <Ionicons name="chevron-forward" size={22} color="#888" />
    </TouchableOpacity>
  );
}

export function PatientsList({ patients, onPressPatient }: PatientsListProps) {
  return (
    <View className="flex-1 px-4 pt-3">
      <FlatList
        data={patients}
        keyExtractor={(item) => item.uid}
        renderItem={({ item }) => (
          <PatientListItem
            patient={item}
            onPress={() => onPressPatient(item)}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}
