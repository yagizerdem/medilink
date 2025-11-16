import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";

export function AskGemini() {
  return (
    <View className="flex-1 bg-[#00897B] pt-10">
      <View className="flex-row items-center px-4 py-3 bg-[#00897B]">
        <TouchableOpacity activeOpacity={0.7}>
          <Ionicons name="arrow-back" size={26} color="white" />
        </TouchableOpacity>

        <Text className="text-white text-lg font-semibold ml-3">
          Medilink AI Assistant
        </Text>
      </View>

      <View className="flex-1 bg-[#DDEFE9] rounded-t-3xl px-4 pt-4 relative">
        <View className="absolute left-3 top-10 bg-white rounded-3xl p-2 shadow-md">
          <View className="items-center space-y-4">
            <TouchableOpacity>
              <Ionicons name="mic-outline" size={22} color="#00897B" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="image-outline" size={22} color="#00897B" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="arrow-redo-outline" size={22} color="#00897B" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="happy-outline" size={22} color="#00897B" />
            </TouchableOpacity>

            <TouchableOpacity>
              <Ionicons name="menu-outline" size={22} color="#00897B" />
            </TouchableOpacity>
          </View>
        </View>

        {/* CHAT MESSAGES */}
        <ScrollView showsVerticalScrollIndicator={false} className="mb-20">
          <View className="bg-[#00897B] self-end px-4 py-3 rounded-xl max-w-[80%] mt-3">
            <Text className="text-white text-sm">
              Hello, I need a recommendation for a headache. What should I take?
            </Text>
          </View>
        </ScrollView>

        {/* MESSAGE INPUT */}
        <View className="absolute bottom-4 left-4 right-4 flex-row items-center bg-white rounded-full px-4 py-2 shadow-md">
          <TextInput
            placeholder="Type your question..."
            placeholderTextColor="#888"
            className="flex-1 text-gray-700"
          />

          <TouchableOpacity activeOpacity={0.8}>
            <View className="bg-[#00897B] w-10 h-10 rounded-full items-center justify-center">
              <Ionicons name="send" size={20} color="white" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}
