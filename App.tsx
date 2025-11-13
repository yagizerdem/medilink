import { SafeAreaView } from "react-native-safe-area-context";
import "./global.css";
import { createStaticNavigation } from "@react-navigation/native";
import { RootStack } from "./navigator";
import { BaseProvider } from "./Provider/BaseProvider";
import Toast from "react-native-toast-message";
import { toastConfig } from "./util/toast";
import { useApp } from "./Provider/AppProvider";
import { View, ActivityIndicator } from "react-native";

export default function AppWrapper() {
  return (
    <BaseProvider>
      <App />
    </BaseProvider>
  );
}

const Navigation = createStaticNavigation(RootStack);

function App() {
  const { isLoading } = useApp();

  return (
    <SafeAreaView className="flex-1 flex-col ">
      {isLoading && (
        <View className="w-full h-full z-10 absolute  bg-transparent">
          <View className="flex-1 justify-center items-center bg-black opacity-90">
            <ActivityIndicator size="large" color="#0000ff" />
          </View>
        </View>
      )}

      <Navigation />
      <Toast config={toastConfig} />
    </SafeAreaView>
  );
}
