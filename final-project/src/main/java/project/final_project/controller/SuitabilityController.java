package project.final_project.controller;

import project.final_project.dto.SuitabilityResponseDto;
import project.final_project.entity.Product;
import project.final_project.entity.UserPreference;
import project.final_project.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;

@RestController   // ✅ 컨트롤러니까 @RestController
@RequestMapping("/api/suitability")
public class SuitabilityController {

    private final ProductRepository productRepository;

    public SuitabilityController(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    @PostMapping("/check")
    public SuitabilityResponseDto checkSuitability(@RequestBody Product product,
                                                   @RequestBody UserPreference preference) {
        String avoid = preference.getAvoidIngredient();

        // description 대신 allergy + name 으로 검사
        boolean unsuitable = (product.getAllergy() != null && product.getAllergy().contains(avoid)) ||
                (product.getName() != null && product.getName().contains(avoid));

        String message;
        boolean suitable;
        if (unsuitable) {
            message = "⚠️ " + avoid + " 성분이 포함되어 있어요.";
            suitable = false;
        } else {
            message = "✅ " + avoid + " 성분이 포함되어 있지 않아요.";
            suitable = true;
        }

        return new SuitabilityResponseDto(suitable, message, java.util.List.of(product));
    }
}
