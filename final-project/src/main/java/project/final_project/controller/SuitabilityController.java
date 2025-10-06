package project.final_project.controller;

import project.final_project.dto.SuitabilityResponseDto;
import project.final_project.entity.Product;
import project.final_project.entity.UserPreference;
import project.final_project.repository.ProductRepository;
import org.springframework.web.bind.annotation.*;
import project.final_project.service.SuitabilityService;

@RestController
@RequestMapping("/api/suitability")
@CrossOrigin(origins = "http://localhost:5173")
public class SuitabilityController {

    private final SuitabilityService suitabilityService;

    public SuitabilityController(SuitabilityService suitabilityService) {
        this.suitabilityService = suitabilityService;
    }

    // 적합성 판단 API
    @GetMapping("/{productId}")
    public SuitabilityResponseDto checkProduct(
            @PathVariable Long productId,
            @RequestParam String username) {
        return suitabilityService.checkSuitability(productId, username);
    }
}