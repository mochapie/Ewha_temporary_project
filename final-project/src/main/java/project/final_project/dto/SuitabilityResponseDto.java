package project.final_project.dto;

import project.final_project.entity.Product;
import java.util.List;

public class SuitabilityResponseDto {
    private boolean suitable;       // 적합 여부
    private List<String> reasons;   // ⚠️ 들어있는 성분들
    private List<String> safeReasons; // ☑️ 들어있지 않은 성분들

    public SuitabilityResponseDto(boolean suitable, List<String> reasons, List<String> safeReasons) {
        this.suitable = suitable;
        this.reasons = reasons;
        this.safeReasons = safeReasons;
    }

    // Getters & Setters
    public boolean isSuitable() { return suitable; }
    public void setSuitable(boolean suitable) { this.suitable = suitable; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public List<String> getSafeReasons() { return safeReasons; }
    public void setSafeReasons(List<String> safeReasons) { this.safeReasons = safeReasons; }
}
