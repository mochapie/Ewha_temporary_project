package project.final_project.service;

import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import project.final_project.entity.Product;
import project.final_project.repository.ProductRepository;

import java.util.List;

@Service
public class ProductService {

    private final ProductRepository productRepository;

    public ProductService(ProductRepository productRepository) {
        this.productRepository = productRepository;
    }

    /**
     * 검색 + 정렬 통합 서비스
     * @param keyword 검색어 (null or 빈문자열이면 전체 검색)
     * @param sortBy 정렬 기준 (예: calories, sodium, sugar, fat, protein, id)
     * @param order 정렬 방향 (asc / desc)
     */
    public List<Product> searchProducts(String keyword, String sortBy, String order) {
        // ✅ 정렬 방향 설정
        Sort sort = order != null && order.equalsIgnoreCase("desc")
                ? Sort.by(Sort.Direction.DESC, sortBy)
                : Sort.by(Sort.Direction.ASC, sortBy);

        // ✅ 검색어 없을 경우 전체 조회
        if (keyword == null || keyword.trim().isEmpty()) {
            return productRepository.findAll(sort);
        }

        // ✅ 검색 + 정렬 동시 처리
        return productRepository.findByNameContainingIgnoreCase(keyword, sort);
    }

    /**
     * 상품 상세 조회
     */
    public Product getProductDetail(Long id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("상품을 찾을 수 없습니다. id=" + id));
    }
}
