package project.final_project.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import project.final_project.dto.SuitabilityResponseDto;
import project.final_project.service.SuitabilityService;

@RestController
@RequestMapping("/api/suitability")
@CrossOrigin(origins = "http://localhost:5173")
public class SuitabilityController {

    private final SuitabilityService suitabilityService;

    public SuitabilityController(SuitabilityService suitabilityService) {
        this.suitabilityService = suitabilityService;
    }

    // ✅ 상품 적합성 판단 API
    @GetMapping("/{productId}")
    public ResponseEntity<SuitabilityResponseDto> checkProduct(
            @PathVariable("productId") Long productId,
            @RequestParam("username") String username) {


        SuitabilityResponseDto result = suitabilityService.checkSuitability(productId, username);
        return ResponseEntity.ok(result);
    }
}
