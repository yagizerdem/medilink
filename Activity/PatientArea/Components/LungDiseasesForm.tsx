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

const lungQuestions = [
  "Do you experience shortness of breath during normal activities?",
  "Do you have a persistent cough?",
  "Do you cough up mucus regularly?",
  "Do you feel chest tightness frequently?",
  "Do you wheeze while breathing?",
  "Do you get breathless even while resting?",
  "Do you wake up at night struggling to breathe?",
  "Do you have frequent respiratory infections?",
  "Do you get tired easily during simple tasks?",
  "Do you have a history of smoking?",
  "Are you exposed to dust or chemicals at work?",
  "Do you feel pain or discomfort when taking a deep breath?",
  "Do you experience rapid breathing during mild activity?",
  "Have you had pneumonia or bronchitis before?",
  "Do you have difficulty exhaling fully?",
  "Do you experience noisy breathing?",
  "Do your symptoms get worse during cold weather?",
  "Do you feel breathless when lying flat?",
  "Does your breathing worsen with exercise?",
  "Do you have any known lung conditions in your family?",
];

interface LungDiseasesFormProps {
  goBack: () => void;
  onHealthCheck: (
    filledForm: { question: string; answer: Answer }[]
  ) => Promise<void>;
}

export function LungDiseasesForm({
  goBack,
  onHealthCheck,
}: LungDiseasesFormProps) {
  const [state, dispatch] = useReducer(reducer, {});
  const { setIsLoading } = useApp();

  async function handleSubmit() {
    try {
      setIsLoading(true);
      const filledForm = Object.keys(state).map((key) => {
        return {
          question: lungQuestions[Number(key)],
          answer: state[Number(key)],
        };
      });

      if (filledForm.length < lungQuestions.length) {
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
          Lung Disease Analysis
        </Text>
      </View>

      <ScrollView className="px-4 pb-10">
        {/* SUBTEXT */}
        <Text className="text-gray-600 text-sm mb-4">
          Please answer the following questions based on your breathing and
          lung-related symptoms:
        </Text>

        {/* QUESTIONS */}
        {lungQuestions.map((q, index) => (
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
