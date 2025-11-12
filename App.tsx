import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import { createStaticNavigation } from "@react-navigation/native";
import { RootStack } from "./navigator";

export default function App() {
  const Navigation = createStaticNavigation(RootStack);

  return (
    <SafeAreaView className="flex-1 flex-col ">
      <Navigation />
    </SafeAreaView>
  );
}
