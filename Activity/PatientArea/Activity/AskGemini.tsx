import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState, useRef, useEffect } from "react";
import Toast from "react-native-toast-message";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { isOperationalError } from "../../../util/isOperationalError";
import { FirebaseError } from "firebase/app";
import { useApp } from "../../../Provider/AppProvider";
import { useNavigation } from "@react-navigation/native";

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  urgency?: "Low" | "Medium" | "High";
  important_notes?: string[];
}

export function AskGemini() {
  const [message, setMessage] = useState<string>("");
  const { setIsLoading } = useApp();
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewRef = useRef<ScrollView>(null);

  const navigation = useNavigation();

  useEffect(() => {
    // Scroll to bottom when messages change
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [messages]);

  async function handleAskToGemini() {
    if (!message.trim()) {
      Toast.show({ type: "error", text1: "Please enter a question." });
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message.trim(),
      isUser: true,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");

    try {
      setIsLoading(true);

      const url =
        "https://us-central1-medilink-dev.cloudfunctions.net/api/ask-gemini";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: userMessage.text }),
      });

      if (!response.ok) {
        throw new Error("Gemini request failed");
      }

      const rawText = await response.text();
      const cleanJsonString = rawText.substring(
        rawText.indexOf("{"),
        rawText.lastIndexOf("}") + 1
      );

      let ai = JSON.parse(cleanJsonString);

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: ai.answer,
        isUser: false,
        timestamp: new Date(),
        urgency: ai.urgency,
        important_notes: ai.important_notes,
      };

      setMessages((prev) => [...prev, aiMessage]);

      Toast.show({
        type: "success",
        text1: "AI response received.",
      });
    } catch (error) {
      console.error("Error:", error);
      if (error instanceof FirebaseError && isOperationalError(error)) {
        Toast.show({ type: "error", text1: getFriendlyAuthMessage(error) });
      } else {
        Toast.show({
          type: "error",
          text1: "An unknown error occurred. Please try again.",
        });
      }
    } finally {
      setIsLoading(false);
    }
  }

  const getUrgencyColor = (urgency?: string) => {
    switch (urgency) {
      case "High":
        return "#EF4444";
      case "Medium":
        return "#F59E0B";
      case "Low":
        return "#10B981";
      default:
        return "#6B7280";
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("tr-TR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-[#00897B]"
      keyboardVerticalOffset={0}
    >
      <View className="flex-1 pt-10">
        <View className="flex-row items-center px-4 py-3 bg-[#00897B]">
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() =>
              // @ts-ignore
              navigation.navigate("PatientApp", {
                screen: "Dashboard",
              } as never)
            }
          >
            <Ionicons name="arrow-back" size={26} color="white" />
          </TouchableOpacity>

          <Text className="text-white text-lg font-semibold ml-3">
            Medilink AI Assistant
          </Text>
        </View>

        <View className="flex-1 bg-[#E5DDD5] rounded-t-3xl relative">
          {/* CHAT MESSAGES */}
          <ScrollView
            ref={scrollViewRef}
            showsVerticalScrollIndicator={false}
            className="flex-1 px-4 pt-4"
            contentContainerStyle={{ paddingBottom: 100 }}
          >
            {messages.length === 0 ? (
              <View className="flex-1 items-center justify-center mt-20">
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color="#00897B"
                />
                <Text className="text-gray-500 text-center mt-4 px-8">
                  Welcome to Medilink AI Assistant{"\n"}
                  Ask me any health-related question
                </Text>
              </View>
            ) : (
              messages.map((msg) => (
                <View
                  key={msg.id}
                  className={`mb-3 ${msg.isUser ? "items-end" : "items-start"}`}
                >
                  <View
                    className={`max-w-[80%] px-4 py-3 rounded-2xl ${
                      msg.isUser
                        ? "bg-[#DCF8C6] rounded-br-sm"
                        : "bg-white rounded-bl-sm"
                    }`}
                    style={{
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 1 },
                      shadowOpacity: 0.1,
                      shadowRadius: 2,
                      elevation: 1,
                    }}
                  >
                    <Text className="text-gray-800 text-[15px] leading-5">
                      {msg.text}
                    </Text>

                    {/* Urgency Badge for AI messages */}
                    {!msg.isUser && msg.urgency && (
                      <View
                        className="mt-2 px-2 py-1 rounded-full self-start"
                        style={{
                          backgroundColor: getUrgencyColor(msg.urgency),
                        }}
                      >
                        <Text className="text-white text-xs font-semibold">
                          {msg.urgency} Urgency
                        </Text>
                      </View>
                    )}

                    {/* Important Notes for AI messages */}
                    {!msg.isUser &&
                      msg.important_notes &&
                      msg.important_notes.length > 0 && (
                        <View className="mt-3 pt-3 border-t border-gray-200">
                          <Text className="text-xs font-semibold text-gray-600 mb-2">
                            ⚠️ Important Notes:
                          </Text>
                          {msg.important_notes.map((note, idx) => (
                            <Text
                              key={idx}
                              className="text-xs text-gray-700 mb-1"
                            >
                              • {note}
                            </Text>
                          ))}
                        </View>
                      )}

                    <Text
                      className={`text-[11px] mt-1 ${
                        msg.isUser ? "text-gray-600" : "text-gray-500"
                      }`}
                    >
                      {formatTime(msg.timestamp)}
                    </Text>
                  </View>
                </View>
              ))
            )}
          </ScrollView>

          {/* MESSAGE INPUT */}
          <View className="absolute bottom-0 left-0 right-0 bg-[#F0F0F0] px-4 py-3 border-t border-gray-300">
            <View className="flex-row items-center bg-white rounded-full px-4 py-2 shadow-sm">
              <TextInput
                placeholder="Type your question..."
                placeholderTextColor="#888"
                className="flex-1 text-gray-700 text-[15px]"
                value={message}
                onChangeText={(text) => setMessage(text)}
                multiline
                maxLength={500}
              />

              <TouchableOpacity
                activeOpacity={0.8}
                onPress={handleAskToGemini}
                disabled={!message.trim()}
              >
                <View
                  className={`w-10 h-10 rounded-full items-center justify-center ${
                    message.trim() ? "bg-[#00897B]" : "bg-gray-300"
                  }`}
                >
                  <Ionicons name="send" size={20} color="white" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}
