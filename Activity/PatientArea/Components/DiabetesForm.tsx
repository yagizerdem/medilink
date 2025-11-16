import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useReducer } from "react";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";
import { useApp } from "../../../Provider/AppProvider";
import { isOperationalError } from "../../../util/isOperationalError";

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

const diabetesQuestions = [
  "Do you frequently feel excessive thirst?",
  "Do you urinate more often than usual?",
  "Do you feel unexplained fatigue or weakness?",
  "Do you experience sudden weight loss?",
  "Do you feel unusually hungry even after eating?",
  "Do you have blurry or reduced vision?",
  "Do your wounds heal slowly?",
  "Do you often experience numbness or tingling in hands or feet?",
  "Do you get frequent skin or yeast infections?",
  "Do you feel increased irritability or mood changes?",
  "Do you have dry mouth frequently?",
  "Do you experience frequent headaches?",
  "Do you notice darker skin patches on your neck, armpits, or groin?",
  "Do you feel shaky, sweaty, or dizzy when hungry?",
  "Do you experience nausea after meals?",
  "Do you have a family history of diabetes?",
  "Do you live a sedentary or low-activity lifestyle?",
  "Do you consume sugary drinks or sweets regularly?",
  "Do you have high blood pressure?",
  "Have you been diagnosed with high blood sugar before?",
];

interface DiabetesFormProps {
  goBack: () => void;
  onHealthCheck: (
    filledForm: { question: string; answer: Answer }[]
  ) => Promise<void>;
}

export function DiabetesForm({ goBack, onHealthCheck }: DiabetesFormProps) {
  const [state, dispatch] = useReducer(reducer, {});
  const { setIsLoading } = useApp();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const filledForm = Object.keys(state).map((key) => {
        return {
          question: diabetesQuestions[Number(key)],
          answer: state[Number(key)],
        };
      });

      if (filledForm.length < diabetesQuestions.length) {
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
        <TouchableOpacity onPress={() => goBack()} className="mx-2">
          <Ionicons name="arrow-back" size={28} />
        </TouchableOpacity>
        <Text className="text-2xl font-semibold text-gray-800">
          Diabetes Risk Analysis
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* Subtext */}
        <Text className="text-gray-600 text-sm mb-4">
          Please answer the following questions based on your recent health
          condition:
        </Text>

        {/* QUESTIONS */}
        {diabetesQuestions.map((q, index) => (
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
