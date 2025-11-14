import { View, Text, TouchableOpacity } from "react-native";

interface RadioProps {
  label: string;
  selected: boolean;
  onPress: () => void;
}

export function RadioButton({ label, selected, onPress }: RadioProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      className="flex-row items-center mr-6"
      style={{ paddingVertical: 4 }}
    >
      <View
        style={{
          width: 20,
          height: 20,
          borderRadius: 10,
          borderWidth: 2,
          borderColor: selected ? "#0f766e" : "#94a3b8",
          alignItems: "center",
          justifyContent: "center",
          marginRight: 6,
        }}
      >
        {selected && (
          <View
            style={{
              width: 10,
              height: 10,
              borderRadius: 5,
              backgroundColor: "#0f766e",
            }}
          />
        )}
      </View>

      <Text className="text-gray-700">{label}</Text>
    </TouchableOpacity>
  );
}
