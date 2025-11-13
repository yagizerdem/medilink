import { ScrollView, View, TouchableOpacity } from "react-native";
import { PharmacistLayoutFooter } from "../../../Components/PharmasistLayoutFooter";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useRef } from "react";
import { useApp } from "../../../Provider/AppProvider";

interface PharmacistLayoutProps {
  children?: React.ReactNode;
}

export function PharmacistLayout({ children }: PharmacistLayoutProps) {
  return (
    <View className="flex-1">
      {children}
      <PharmacistLayoutFooter />
    </View>
  );
}
