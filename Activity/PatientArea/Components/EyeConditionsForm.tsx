import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useReducer } from "react";
import Toast from "react-native-toast-message";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";
import { FirebaseError } from "firebase/app";
import { isOperationalError } from "../../../util/isOperationalError";
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

const eyeQuestions = [
  "Do you experience blurry or unclear vision?",
  "Do you have difficulty seeing at night?",
  "Do you feel eye pain or pressure?",
  "Do your eyes get red frequently?",
  "Do you have sensitivity to bright lights?",
  "Do you see floaters, flashes, or dark spots?",
  "Do you have difficulty focusing on near objects?",
  "Do you have difficulty focusing on distant objects?",
  "Do you experience frequent headaches related to vision?",
  "Do your eyes feel dry, itchy, or burning?",
  "Do you have sudden changes in vision?",
  "Do you struggle reading small text even with glasses?",
  "Do your eyes tear excessively?",
  "Do you have double vision?",
  "Do you notice halos around lights?",
  "Do your eyelids swell often?",
  "Do you have a family history of eye diseases?",
  "Do you have diabetes or high blood pressure?",
  "Do you feel increased eye strain after screen use?",
  "Do you experience reduced peripheral (side) vision?",
];

interface EyeConditionsFormProps {
  goBack: () => void;
  onHealthCheck: (
    filledForm: { question: string; answer: Answer }[]
  ) => Promise<void>;
}

export function EyeConditionsForm({
  goBack,
  onHealthCheck,
}: EyeConditionsFormProps) {
  const [state, dispatch] = useReducer(reducer, {});
  const { setIsLoading } = useApp();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const filledForm = Object.keys(state).map((key) => {
        return {
          question: eyeQuestions[Number(key)],
          answer: state[Number(key)],
        };
      });

      if (filledForm.length < eyeQuestions.length) {
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
          Eye Conditions Analysis
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* SUBTEXT */}
        <Text className="text-gray-600 text-sm mb-4">
          Please answer the following questions based on your current eye
          condition:
        </Text>

        {/* QUESTIONS */}
        {eyeQuestions.map((q, index) => (
          <View
            key={index}
            className="bg-white rounded-2xl p-4 mb-4 shadow-sm border border-gray-200"
          >
            <Text className="text-gray-800 text-base mb-3">{q}</Text>

            {/* YES / NO OPTIONS */}
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
