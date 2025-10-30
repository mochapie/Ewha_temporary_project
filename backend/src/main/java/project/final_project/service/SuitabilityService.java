package project.final_project.service;

import org.springframework.stereotype.Service;
import project.final_project.entity.Product;
import project.final_project.entity.UserPreference;
import project.final_project.repository.ProductRepository;
import project.final_project.repository.UserPreferenceRepository;
import project.final_project.dto.SuitabilityResponseDto;

import java.util.ArrayList;
import java.util.List;

@Service
public class SuitabilityService {


    private final ProductRepository productRepository;
    private final UserPreferenceRepository preferenceRepository;

    public SuitabilityService(ProductRepository productRepository,
                              UserPreferenceRepository preferenceRepository) {
        this.productRepository = productRepository;
        this.preferenceRepository = preferenceRepository;
    }

    public SuitabilityResponseDto checkSuitability(Long productId, String username) {
        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다."));

        UserPreference preference = preferenceRepository.findByUsername(username)
                .orElseThrow(() -> new IllegalArgumentException("사용자 정보를 찾을 수 없습니다."));

        List<String> reasons = new ArrayList<>();
        List<String> safeReasons = new ArrayList<>();

        boolean hasDirectAllergy = false;
        boolean hasIndirectAllergy = false;

        // 직접 알레르기 체크
        if (preference.getAllergy() != null) {
            for (String allergy : preference.getAllergy().split(",")) {
                String trimmed = allergy.trim();
                if (product.getAllergy() != null && product.getAllergy().contains(trimmed)) {
                    hasDirectAllergy = true;
                    reasons.add("⚠️ " + trimmed + " 성분이 함유되어 있습니다.");
                } else {
                    safeReasons.add("☑️ " + trimmed + " 성분이 함유되어 있지 않습니다.");
                }
            }
        }

        // 간접 알레르기 체크
        if (preference.getIndirectAllergy() != null) {
            for (String indirect : preference.getIndirectAllergy().split(",")) {
                String trimmed = indirect.trim();
                if (product.getIndirectAllergy() != null && product.getIndirectAllergy().contains(trimmed)) {
                    hasIndirectAllergy = true;
                    reasons.add("⚠️ " + trimmed + " 성분이 미량 포함될 수 있습니다.");
                } else {
                    safeReasons.add("☑️ " + trimmed + " 성분이 미량 포함되지 않습니다.");
                }
            }
        }

        // ✅ 적합성 단계 판정
        String status;
        if (hasDirectAllergy) {
            status = "unsuitable"; // 부적합
        } else if (hasIndirectAllergy) {
            status = "caution"; // 주의 필요
        } else {
            status = "suitable"; // 적합
        }

        return new SuitabilityResponseDto(status, reasons, safeReasons);
    }

}
