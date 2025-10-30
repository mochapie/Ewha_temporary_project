package project.final_project.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class AiRecommendationResponse {

    // ✅ JSON 응답 시 "ai_description"으로 변환됨
    @JsonProperty("ai_description")
    private String aiDescription;

    // ✅ JSON 응답 시 "nutrition_analysis"으로 변환됨
    @JsonProperty("nutrition_analysis")
    private List<NutritionResult> nutritionAnalysis;

    public AiRecommendationResponse() {}

    public AiRecommendationResponse(String aiDescription, List<NutritionResult> nutritionAnalysis) {
        this.aiDescription = aiDescription;
        this.nutritionAnalysis = nutritionAnalysis;
    }

    public String getAiDescription() {
        return aiDescription;
    }

    public void setAiDescription(String aiDescription) {
        this.aiDescription = aiDescription;
    }

    public List<NutritionResult> getNutritionAnalysis() {
        return nutritionAnalysis;
    }

    public void setNutritionAnalysis(List<NutritionResult> nutritionAnalysis) {
        this.nutritionAnalysis = nutritionAnalysis;
    }

    // ✅ 내부 클래스 NutritionResult도 영어 기반으로 변경
    public static class NutritionResult {

        @JsonProperty("nutrient")
        private String nutrient;  // (ex: 나트륨)

        @JsonProperty("evaluation")
        private String evaluation; // (ex: 평균보다 높음)

        public NutritionResult() {}

        public NutritionResult(String nutrient, String evaluation) {
            this.nutrient = nutrient;
            this.evaluation = evaluation;
        }

        public String getNutrient() {
            return nutrient;
        }

        public void setNutrient(String nutrient) {
            this.nutrient = nutrient;
        }

        public String getEvaluation() {
            return evaluation;
        }

        public void setEvaluation(String evaluation) {
            this.evaluation = evaluation;
        }
    }
}
