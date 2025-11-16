import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useReducer } from "react";
import { isOperationalError } from "../../../util/isOperationalError";
import { FirebaseError } from "firebase/app";
import Toast from "react-native-toast-message";
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

const bmiQuestions = [
  "Do you experience sudden weight gain or loss?",
  "Do you have difficulty maintaining a stable weight?",
  "Do you frequently feel tired or low on energy?",
  "Do you feel breathless during light activities?",
  "Do you have joint pain related to weight?",
  "Do you feel excessively hungry during the day?",
  "Do you consume fast food more than twice a week?",
  "Do you drink sugary beverages often?",
  "Do you exercise less than 3 times a week?",
  "Do you spend long hours sitting daily?",
  "Do you often feel bloated or uncomfortable after meals?",
  "Do you have a family history of obesity?",
  "Do you struggle with emotional or stress eating?",
  "Do you gain weight easily even with small meals?",
  "Do you have trouble sleeping or poor sleep quality?",
  "Do you often skip breakfast?",
  "Do you eat late at night frequently?",
  "Do you snack between meals often?",
  "Do you have difficulty losing weight despite trying?",
  "Do you feel low confidence related to your weight?",
];

interface BodyMassIndexFormProps {
  goBack: () => void;
  onHealthCheck: (
    filledForm: { question: string; answer: Answer }[]
  ) => Promise<void>;
}

export function BodyMassIndexForm({
  goBack,
  onHealthCheck,
}: BodyMassIndexFormProps) {
  const [state, dispatch] = useReducer(reducer, {});
  const { setIsLoading } = useApp();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const filledForm = Object.keys(state).map((key) => {
        return {
          question: bmiQuestions[Number(key)],
          answer: state[Number(key)],
        };
      });

      if (filledForm.length < bmiQuestions.length) {
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
          BMI Risk Analysis
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* Subtext */}
        <Text className="text-gray-600 text-sm mb-4">
          Please answer the following questions based on your lifestyle and
          weight-related habits:
        </Text>

        {/* QUESTIONS */}
        {bmiQuestions.map((q, index) => (
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
