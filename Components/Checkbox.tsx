import { TouchableOpacity, View, Text } from "react-native";

interface CheckboxProps {
  label: string;
  checked: boolean;
  onPress: () => void;
}

export function Checkbox({ label, checked, onPress }: CheckboxProps) {
  return (
    <TouchableOpacity
      onPress={onPress}
      style={{
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 14,
      }}
    >
      {/* Outer box */}
      <View
        style={{
          width: 22,
          height: 22,
          borderRadius: 4,
          borderWidth: 2,
          borderColor: checked ? "#0f766e" : "#94a3b8",
          backgroundColor: checked ? "#0f766e" : "white",
          marginRight: 12,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {/* check icon */}
        {checked && (
          <View
            style={{
              width: 10,
              height: 10,
              backgroundColor: "white",
              borderRadius: 2,
            }}
          />
        )}
      </View>

      <Text className="text-gray-700 text-base">{label}</Text>
    </TouchableOpacity>
  );
}
