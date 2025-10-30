package project.final_project.controller;

import project.final_project.entity.Product;
import project.final_project.service.ProductService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173")  // React 개발 서버 주소 허용
public class ProductController {

    private final ProductService productService;

    public ProductController(ProductService productService) {
        this.productService = productService;
    }

    // 검색 + 정렬 API
    @GetMapping("/search")
    public List<Product> searchProducts(
            @RequestParam(name = "keyword", required = false) String keyword,
            @RequestParam(name = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(name = "order", defaultValue = "asc") String order
    ) {
        return productService.searchProducts(keyword, sortBy, order);
    }

    // 상세 조회 API
    @GetMapping("/{id}")
    public Product getProductDetail(@PathVariable("id") Long id) {
        return productService.getProductDetail(id);
    }
}
