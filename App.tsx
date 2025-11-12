import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import { GateActivitiy } from "./Activity/Gate";

export default function App() {
  return (
    <SafeAreaView className="flex-1 flex-col ">
      <GateActivitiy />
    </SafeAreaView>
  );
}
