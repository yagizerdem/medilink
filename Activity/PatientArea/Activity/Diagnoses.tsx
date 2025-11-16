import { View, Text, TouchableOpacity, ScrollView, Modal } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Fragment, useState } from "react";
import { HeartDiseaseForm } from "../Components/HeartDiseaseForm";
import { DiabetesForm } from "../Components/DiabetesForm";
import { BodyMassIndexForm } from "../Components/BodyMassForm";
import { PregnancyRiskForm } from "../Components/PregnancyForm";
import { EyeConditionsForm } from "../Components/EyeConditionsForm";
import { LungDiseasesForm } from "../Components/LungDiseasesForm";
import { MentalHealthForm } from "../Components/MentalHealthForm";
import { useApp } from "../../../Provider/AppProvider";
import Toast from "react-native-toast-message";
import { FirebaseError } from "firebase/app";
import { isOperationalError } from "../../../util/isOperationalError";
import { getFriendlyAuthMessage } from "../../../util/getFriendlyMessage";

enum DiagnosisType {
  HeartDisease,
  Diabetes,
  BodyMassIndex,
  PregnancyRisks,
  EyeConditions,
  LungDiseases,
  MentalHealthAnalysis,
}

export function Diagnoses() {
  const { setIsLoading } = useApp();

  const items = [
    {
      title: "Heart Disease",
      icon: "heart-outline",
      type: DiagnosisType.HeartDisease,
    },
    { title: "Diabetes", icon: "water-outline", type: DiagnosisType.Diabetes },
    {
      title: "Body Mass Index",
      icon: "scale-outline",
      type: DiagnosisType.BodyMassIndex,
    },
    {
      title: "Pregnancy Risks",
      icon: "woman-outline",
      type: DiagnosisType.PregnancyRisks,
    },
    {
      title: "Eye Conditions",
      icon: "eye-outline",
      type: DiagnosisType.EyeConditions,
    },
    {
      title: "Lung Diseases",
      icon: "cloud-outline",
      type: DiagnosisType.LungDiseases,
    },
    {
      title: "Mental Health Analysis",
      icon: "happy-outline",
      type: DiagnosisType.MentalHealthAnalysis,
    },
  ];

  const [diagnosisType, setDiagnosisType] = useState<DiagnosisType | null>(
    null
  );

  const [geminiResponse, setGeminiResponse] =
    useState<HealthAnalysisData | null>(null);

  async function onHealthCheck(
    filledForm: { question: string; answer: "yes" | "no" | null }[]
  ) {
    try {
      setIsLoading(true);

      // --- GEMINI API REQUEST (CLOUD FUNCTION) ---
      const url =
        "https://us-central1-medilink-dev.cloudfunctions.net/api/health-analysis";

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ answers: filledForm }),
      });

      if (!response.ok) {
        throw new Error("API error");
      }

      const result = JSON.parse(await response.text()) as HealthAnalysisData;
      setGeminiResponse(result);
      Toast.show({
        type: "success",
        text1: "Analysis completed successfully.",
      });

      console.log(result);
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

  if (diagnosisType === DiagnosisType.HeartDisease) {
    return (
      <Fragment>
        {geminiResponse && (
          <HealthAnalysisModal
            visible={true}
            onClose={() => setGeminiResponse(null)}
            data={geminiResponse}
          />
        )}
        <HeartDiseaseForm
          goBack={() => setDiagnosisType(null)}
          onHealthCheck={onHealthCheck}
        />
      </Fragment>
    );
  }

  if (diagnosisType === DiagnosisType.Diabetes) {
    return (
      <Fragment>
        {geminiResponse && (
          <HealthAnalysisModal
            visible={true}
            onClose={() => setGeminiResponse(null)}
            data={geminiResponse}
          />
        )}
        <DiabetesForm
          goBack={() => setDiagnosisType(null)}
          onHealthCheck={onHealthCheck}
        />
      </Fragment>
    );
  }

  if (diagnosisType === DiagnosisType.BodyMassIndex) {
    return (
      <Fragment>
        {geminiResponse && (
          <HealthAnalysisModal
            visible={true}
            onClose={() => setGeminiResponse(null)}
            data={geminiResponse}
          />
        )}
        <BodyMassIndexForm
          goBack={() => setDiagnosisType(null)}
          onHealthCheck={onHealthCheck}
        />
      </Fragment>
    );
  }

  if (diagnosisType === DiagnosisType.PregnancyRisks) {
    return (
      <Fragment>
        {geminiResponse && (
          <HealthAnalysisModal
            visible={true}
            onClose={() => setGeminiResponse(null)}
            data={geminiResponse}
          />
        )}
        <PregnancyRiskForm
          goBack={() => setDiagnosisType(null)}
          onHealthCheck={onHealthCheck}
        />
      </Fragment>
    );
  }

  if (diagnosisType === DiagnosisType.EyeConditions) {
    return (
      <Fragment>
        {geminiResponse && (
          <HealthAnalysisModal
            visible={true}
            onClose={() => setGeminiResponse(null)}
            data={geminiResponse}
          />
        )}
        <EyeConditionsForm
          goBack={() => setDiagnosisType(null)}
          onHealthCheck={onHealthCheck}
        />
      </Fragment>
    );
  }

  if (diagnosisType === DiagnosisType.LungDiseases) {
    return (
      <Fragment>
        {geminiResponse && (
          <HealthAnalysisModal
            visible={true}
            onClose={() => setGeminiResponse(null)}
            data={geminiResponse}
          />
        )}
        <LungDiseasesForm
          goBack={() => setDiagnosisType(null)}
          onHealthCheck={onHealthCheck}
        />
      </Fragment>
    );
  }
  if (diagnosisType === DiagnosisType.MentalHealthAnalysis) {
    return (
      <Fragment>
        {geminiResponse && (
          <HealthAnalysisModal
            visible={true}
            onClose={() => setGeminiResponse(null)}
            data={geminiResponse}
          />
        )}
        <MentalHealthForm
          goBack={() => setDiagnosisType(null)}
          onHealthCheck={onHealthCheck}
        />
      </Fragment>
    );
  }

  return (
    <Fragment>
      <View className="flex-1 bg-[#00897B] pt-10">
        {/* HEADER */}
        <View className="w-full flex-row items-center px-4 mb-4">
          <Text className="text-white text-xl font-semibold ml-2">
            Disease Detection
          </Text>
        </View>

        {/* CONTENT CARD */}
        <View className="flex-1 bg-teal-50 rounded-t-3xl px-6 py-5 shadow-xl">
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* TOP BADGE */}
            <View className="items-center mb-4">
              <View className="w-14 h-14 bg-[#00897B] rounded-full items-center justify-center">
                <Ionicons name="medical" size={32} color="white" />
              </View>
            </View>

            {/* TITLE */}
            <Text className="text-center text-gray-700 text-base mb-4">
              Select the condition you want to analyze based on symptoms:
            </Text>

            {/* GRID */}
            <View className="flex-row flex-wrap justify-between">
              {items.map((item, index) => (
                <TouchableOpacity
                  onPress={() => setDiagnosisType(item.type)}
                  key={index}
                  className="
              w-[48%] 
              h-28 
              bg-[#009688] 
              rounded-xl 
              items-center 
              justify-center 
              mb-4
            "
                  activeOpacity={0.8}
                >
                  <Ionicons name={item.icon as any} size={32} color="white" />
                  <Text className="text-white text-sm mt-2 text-center font-medium">
                    {item.title}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </View>
      </View>
    </Fragment>
  );
}

interface CriticalSymptom {
  symptom: string;
  reason: string;
}

interface HealthAnalysisData {
  risk_level: "Low" | "Moderate" | "High";
  score: number;
  summary: string;
  critical_symptoms: CriticalSymptom[];
  recommendations: string[];
}

interface HealthAnalysisModalProps {
  visible: boolean;
  onClose: () => void;
  data: HealthAnalysisData | null;
}

function HealthAnalysisModal({
  visible,
  onClose,
  data,
}: HealthAnalysisModalProps) {
  if (!data) return null;

  const riskColor =
    data.risk_level === "High"
      ? "bg-red-100"
      : data.risk_level === "Moderate"
        ? "bg-yellow-100"
        : "bg-green-100";

  const riskTextColor =
    data.risk_level === "High"
      ? "text-red-700"
      : data.risk_level === "Moderate"
        ? "text-yellow-700"
        : "text-green-700";

  return (
    <Modal visible={visible} animationType="fade" transparent>
      <View className="flex-1 bg-black/50 justify-center items-center px-4">
        <View className="w-full max-w-md bg-white rounded-2xl p-6 shadow-xl">
          {/* HEADER */}
          <View className="flex-row justify-between items-center mb-3">
            <Text className="text-xl font-bold text-gray-900">
              Health Analysis Result
            </Text>

            <TouchableOpacity onPress={onClose}>
              {/* Ionicon directly, type-safe */}
              <Ionicons name="close" size={28} color="#555" />
            </TouchableOpacity>
          </View>

          {/* SUBTITLE */}
          <Text className="text-gray-600 mb-4 text-sm">
            AI-based interpretation of your answers:
          </Text>

          <ScrollView
            className="max-h-[400px]"
            showsVerticalScrollIndicator={false}
          >
            {/* RISK BADGE */}
            <View
              className={`px-4 py-2 rounded-full self-start mb-4 ${riskColor}`}
            >
              <Text className={`font-bold ${riskTextColor}`}>
                {data.risk_level} Risk
              </Text>
            </View>

            {/* SCORE */}
            <Text className="text-gray-700 text-base mb-2">
              <Text className="font-semibold">Score:</Text> {data.score}/100
            </Text>

            {/* SUMMARY */}
            <Text className="text-gray-700 text-base mb-4">
              <Text className="font-semibold">Summary: </Text>
              {data.summary}
            </Text>

            {/* CRITICAL SYMPTOMS */}
            {data.critical_symptoms.length > 0 && (
              <View className="mb-4">
                <Text className="text-lg font-semibold text-gray-900 mb-2">
                  Key Symptoms
                </Text>

                {data.critical_symptoms.map((item, i) => (
                  <View
                    key={i}
                    className="bg-gray-100 border border-gray-200 p-3 rounded-xl mb-2"
                  >
                    <Text className="text-gray-800 font-semibold">
                      • {item.symptom}
                    </Text>
                    <Text className="text-gray-600 text-sm mt-1">
                      {item.reason}
                    </Text>
                  </View>
                ))}
              </View>
            )}

            {/* RECOMMENDATIONS */}
            <View className="mt-3 mb-4">
              <Text className="text-lg font-semibold text-gray-900 mb-2">
                Recommendations
              </Text>

              {data.recommendations.map((rec, i) => (
                <View key={i} className="flex-row items-start mb-2">
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color="#00897B"
                    style={{ marginTop: 2, marginRight: 6 }}
                  />
                  <Text className="text-gray-700 text-sm">{rec}</Text>
                </View>
              ))}
            </View>
          </ScrollView>

          {/* BUTTON */}
          <TouchableOpacity
            className="bg-[#00897B] py-3 mt-2 rounded-2xl"
            onPress={onClose}
          >
            <Text className="text-white text-center font-semibold text-lg">
              Close
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}
