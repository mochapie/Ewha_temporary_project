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

        boolean suitable = true;
        List<String> reasons = new ArrayList<>();
        List<String> safeReasons = new ArrayList<>();

        // 알레르기 체크
        if (preference.getAllergy() != null) {
            for (String allergy : preference.getAllergy().split(",")) {
                if (product.getAllergy() != null && product.getAllergy().contains(allergy.trim())) {
                    suitable = false;
                    reasons.add("⚠️ " + allergy + " 성분이 함유되어 있습니다.");
                } else {
                    safeReasons.add("☑️ " + allergy + " 성분이 함유되어 있지 않습니다.");
                }
            }
        }

        // 간접 알레르기 체크
        if (preference.getIndirectAllergy() != null) {
            for (String indirect : preference.getIndirectAllergy().split(",")) {
                if (product.getIndirectAllergy() != null && product.getIndirectAllergy().contains(indirect.trim())) {
                    suitable = false;
                    reasons.add("⚠️ " + indirect + " 성분이 함유되어 있습니다.");
                } else {
                    safeReasons.add("☑️ " + indirect + " 성분이 함유되어 있지 않습니다.");
                }
            }
        }

        return new SuitabilityResponseDto(suitable, reasons, safeReasons);
    }
}
