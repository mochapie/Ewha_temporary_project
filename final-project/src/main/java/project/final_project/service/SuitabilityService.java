package project.final_project.service;

import project.final_project.dto.SuitabilityResponseDto;
import project.final_project.entity.Product;
import project.final_project.entity.UserPreference;
import project.final_project.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SuitabilityService {


    private final ProductRepository productRepository;

    public SuitabilityService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public SuitabilityResponseDto checkSuitability(Product product, UserPreference preference) {
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

        List<Product> recommendations = productRepository.findAll()
                .stream()
                .filter(p -> !p.getId().equals(product.getId()))
                .limit(3)
                .toList();

        return new SuitabilityResponseDto(suitable, message, recommendations);
    }
}
