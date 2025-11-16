import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useReducer } from "react";
import Toast from "react-native-toast-message";
import { FirebaseError } from "firebase/app";
import { isOperationalError } from "../../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { useApp } from "../../../Provider/AppProvider";

type Answer = "yes" | "no" | null;

type State = {
  [key: number]: Answer;
};

type Action = {
  index: number;
  answer: Answer;
};

function reducer(state: State, action: Action): State {
  return {
    ...state,
    [action.index]: action.answer,
  };
}

const mentalHealthQuestions = [
  "Do you feel sad or empty most days?",
  "Do you have trouble enjoying activities you used to like?",
  "Do you often feel anxious or worried?",
  "Do you experience sudden panic or fear?",
  "Do you have difficulty concentrating or remembering things?",
  "Do you feel tired or low on energy frequently?",
  "Do you struggle to fall asleep or stay asleep?",
  "Do you sleep too much or too little?",
  "Do you feel hopeless about the future?",
  "Do you feel guilty or worthless without clear reason?",
  "Do you get easily irritated or annoyed?",
  "Do you feel overwhelmed by daily tasks?",
  "Do you avoid social interactions recently?",
  "Do you experience sudden mood swings?",
  "Do you have changes in appetite or weight?",
  "Do you feel disconnected from people or surroundings?",
  "Do you experience frequent headaches or tension?",
  "Do you have thoughts of harming yourself?",
  "Do you feel stressed most of the day?",
  "Do you feel like you’re losing control emotionally?",
];

interface MentalHealthFormProps {
  goBack: () => void;
  onHealthCheck: (
    filledForm: { question: string; answer: Answer }[]
  ) => Promise<void>;
}

export function MentalHealthForm({
  goBack,
  onHealthCheck,
}: MentalHealthFormProps) {
  const [state, dispatch] = useReducer(reducer, {});
  const { setIsLoading } = useApp();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const filledForm = Object.keys(state).map((key) => {
        return {
          question: mentalHealthQuestions[Number(key)],
          answer: state[Number(key)],
        };
      });

      if (filledForm.length < mentalHealthQuestions.length) {
        Toast.show({
          type: "error",
          text1: "Please answer all questions before submitting.",
        });
        return;
      }
      await onHealthCheck(filledForm);
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

  return (
    <View className="flex-1 bg-teal-50 pt-10">
      {/* HEADER */}
      <View className="flex-row items-center px-4 mb-4">
        <TouchableOpacity onPress={goBack} className="mx-2">
          <Ionicons name="arrow-back" size={28} />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-800">
          Mental Health Analysis
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* SUBTEXT */}
        <Text className="text-gray-600 text-sm mb-4">
          Please answer honestly based on your recent mental and emotional
          state.
        </Text>

        {/* QUESTIONS */}
        {mentalHealthQuestions.map((q, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
          >
            <Text className="text-gray-800 text-base mb-3">{q}</Text>

            {/* YES / NO */}
            <View className="flex-row justify-between px-2">
              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => dispatch({ index, answer: "yes" })}
              >
                <Ionicons
                  name={
                    state[index] === "yes"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color={state[index] === "yes" ? "#00897B" : "#777"}
                />
                <Text className="ml-2 text-gray-700">Yes</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="flex-row items-center"
                onPress={() => dispatch({ index, answer: "no" })}
              >
                <Ionicons
                  name={
                    state[index] === "no"
                      ? "radio-button-on"
                      : "radio-button-off"
                  }
                  size={22}
                  color={state[index] === "no" ? "#00897B" : "#777"}
                />
                <Text className="ml-2 text-gray-700">No</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        {/* SUBMIT BUTTON */}
        <TouchableOpacity
          className="bg-[#00897B] py-4 rounded-2xl mt-4 mb-10"
          onPress={() => handleSubmit()}
        >
          <Text className="text-center text-white font-semibold text-lg">
            Submit Assessment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
