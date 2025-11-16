import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useReducer } from "react";
import Toast from "react-native-toast-message";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { isOperationalError } from "../../../util/isOperationalError";
import { FirebaseError } from "firebase/app";
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

const pregnancyQuestions = [
  "Are you experiencing severe abdominal pain?",
  "Do you have vaginal bleeding during pregnancy?",
  "Do you feel severe nausea or persistent vomiting?",
  "Do you experience severe headaches regularly?",
  "Do you have blurry vision or flashing lights in your vision?",
  "Do your hands, feet, or face swell suddenly?",
  "Do you feel reduced or irregular fetal movements?",
  "Do you have high blood pressure?",
  "Have you had gestational diabetes before?",
  "Have you had preeclampsia in previous pregnancies?",
  "Do you have a family history of pregnancy complications?",
  "Are you over 35 years old?",
  "Do you smoke or consume alcohol?",
  "Do you have chronic illnesses (heart, kidney, thyroid)?",
  "Do you have frequent dizziness or fainting?",
  "Do you experience contractions before 37 weeks?",
  "Do you have urinary burning, pain, or frequent infections?",
  "Do you feel persistent shortness of breath?",
  "Have you gained weight too quickly or too slowly?",
  "Do you experience severe fatigue beyond normal pregnancy symptoms?",
];

interface PregnancyRiskFormProps {
  goBack: () => void;
  onHealthCheck: (
    filledForm: { question: string; answer: Answer }[]
  ) => Promise<void>;
}

export function PregnancyRiskForm({
  goBack,
  onHealthCheck,
}: PregnancyRiskFormProps) {
  const [state, dispatch] = useReducer(reducer, {});
  const { setIsLoading } = useApp();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const filledForm = Object.keys(state).map((key) => {
        return {
          question: pregnancyQuestions[Number(key)],
          answer: state[Number(key)],
        };
      });

      if (filledForm.length < pregnancyQuestions.length) {
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
          Pregnancy Risk Analysis
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* Subtext */}
        <Text className="text-gray-600 text-sm mb-4">
          Please answer the following questions to evaluate pregnancy-related
          risks:
        </Text>

        {/* QUESTIONS */}
        {pregnancyQuestions.map((q, index) => (
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
