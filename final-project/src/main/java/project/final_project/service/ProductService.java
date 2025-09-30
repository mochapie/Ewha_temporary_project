package project.final_project.service;

import project.final_project.entity.Product;
import project.final_project.repository.ProductRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    public List<Product> searchProducts(String keyword) {
        System.out.println("검색어: " + keyword);  // 로그 찍기

        if (keyword == null || keyword.isEmpty()) {
            return productRepository.findAll();
        }

        // 기존
        // return productRepository.findByNameContaining(keyword);

        // 수정
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }

    public Product getProductDetail(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. id=" + id));
    }
}
