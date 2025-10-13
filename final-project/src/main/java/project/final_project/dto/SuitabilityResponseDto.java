package project.final_project.dto;

import java.util.List;

public class SuitabilityResponseDto {
    private String status; // "suitable", "unsuitable", "caution"
    private List<String> reasons;
    private List<String> safeReasons;

    public SuitabilityResponseDto(String status, List<String> reasons, List<String> safeReasons) {
        this.status = status;
        this.reasons = reasons;
        this.safeReasons = safeReasons;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public List<String> getReasons() { return reasons; }
    public void setReasons(List<String> reasons) { this.reasons = reasons; }

    public List<String> getSafeReasons() { return safeReasons; }
    public void setSafeReasons(List<String> safeReasons) { this.safeReasons = safeReasons; }
}
