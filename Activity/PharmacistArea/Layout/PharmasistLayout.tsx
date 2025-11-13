import { ScrollView, View } from "react-native";
import { PharmacistLayoutFooter } from "../../../Components/PharmasistLayoutFooter";

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
