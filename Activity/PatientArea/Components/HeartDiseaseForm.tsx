import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useEffect, useReducer } from "react";
import { useApp } from "../../../Provider/AppProvider";
import { isOperationalError } from "../../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";

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

const heartDiseaseQuestions = [
  "Do you often experience chest pain or tightness?",
  "Do you feel shortness of breath during routine activities?",
  "Do you experience irregular or rapid heartbeat?",
  "Do your ankles, feet, or legs swell frequently?",
  "Do you feel unusually tired even with little activity?",
  "Do you experience dizziness or fainting episodes?",
  "Do you have high blood pressure?",
  "Do you have high cholesterol?",
  "Do you have a family history of heart disease?",
  "Are you diabetic or at risk of diabetes?",
  "Do you smoke or have a history of smoking?",
  "Do you feel tightness in your chest after meals?",
  "Do you have difficulty breathing when lying down?",
  "Do you wake up at night feeling breathless?",
  "Do you experience pain in your arms, neck, jaw, or back?",
  "Have you experienced unexplained sweating recently?",
  "Do you frequently feel weak or lightheaded?",
  "Do you get tired faster than people your age?",
  "Do you have frequent headaches related to high blood pressure?",
  "Do you have difficulty concentrating or mental fog?",
];

interface HeartDiseaseFormProps {
  goBack: () => void;
  onHealthCheck: (
    filledForm: { question: string; answer: Answer }[]
  ) => Promise<void>;
}

export function HeartDiseaseForm({
  goBack,
  onHealthCheck,
}: HeartDiseaseFormProps) {
  const [state, dispatch] = useReducer(reducer, {});
  const { setIsLoading } = useApp();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const filledForm = Object.keys(state).map((key) => {
        return {
          question: heartDiseaseQuestions[Number(key)],
          answer: state[Number(key)],
        };
      });

      if (filledForm.length < heartDiseaseQuestions.length) {
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
          Heart Disease Analysis
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* Subtext */}
        <Text className="text-gray-600 text-sm mb-4">
          Please answer the following questions based on your recent health
          condition:
        </Text>

        {/* QUESTIONS */}
        {heartDiseaseQuestions.map((q, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
          >
            <Text className="text-gray-800 text-base mb-3">{q}</Text>

            {/* YES / NO CHOICES */}
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
          onPress={handleSubmit}
        >
          <Text className="text-center text-white font-semibold text-lg">
            Submit Assessment
          </Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}
