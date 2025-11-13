import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  Pressable,
} from "react-native";

interface Props {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ visible, onCancel, onConfirm }: Props) {
  const [render, setRender] = useState(visible);

  const bgOpacity = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    if (visible) {
      setRender(true);

      Animated.parallel([
        Animated.timing(bgOpacity, {
          toValue: 1,
          duration: 160,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 6,
          tension: 80,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(bgOpacity, {
          toValue: 0,
          duration: 150,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 0.8,
          duration: 150,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setRender(false);
      });
    }
  }, [visible]);

  if (!render) return null;

  return (
    <View
      style={{
        position: "absolute",
        inset: 0,
        justifyContent: "center",
        alignItems: "center",
        zIndex: 9999,
      }}
    >
      <Animated.View
        style={{
          position: "absolute",
          inset: 0,
          backgroundColor: "rgba(0,0,0,0.9)",
          opacity: bgOpacity,
        }}
      />

      <Pressable
        onPress={onCancel}
        style={{ position: "absolute", inset: 0 }}
      />

      <Animated.View
        style={{
          width: "80%",
          backgroundColor: "white",
          borderRadius: 20,
          padding: 20,
          transform: [{ scale: scaleAnim }],
        }}
      >
        <Text className="text-xl font-semibold text-red-700 mb-3">
          Delete Account?
        </Text>

        <Text className="text-gray-600 mb-6">
          This action is irreversible. All your data will be permanently
          removed.
        </Text>

        <View className="flex-row justify-end gap-4">
          <TouchableOpacity onPress={onCancel}>
            <Text className="text-teal-700 font-semibold text-base">
              Cancel
            </Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={onConfirm}>
            <Text className="text-red-600 font-semibold text-base">Delete</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>
    </View>
  );
}
