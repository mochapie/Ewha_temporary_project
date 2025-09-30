package project.final_project.dto;

import project.final_project.entity.Product;
import java.util.List;

public class SuitabilityResponseDto {

    private boolean suitable;          // 적합 여부
    private String message;            // 메시지
    private List<Product> recommended; // 추천 상품 리스트

    // 기본 생성자 (JSON 직렬화/역직렬화를 위해 필요)
    public SuitabilityResponseDto() {}

    // 전체 필드를 초기화하는 생성자
    public SuitabilityResponseDto(boolean suitable, String message, List<Product> recommended) {
        this.suitable = suitable;
        this.message = message;
        this.recommended = recommended;
    }

    // Getter 메서드들
    public boolean isSuitable() {
        return suitable;
    }

    public String getMessage() {
        return message;
    }

    public List<Product> getRecommended() {
        return recommended;
    }

    public void setSuitable(boolean suitable) {
        this.suitable = suitable;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setRecommended(List<Product> recommended) {
        this.recommended = recommended;
    }
}