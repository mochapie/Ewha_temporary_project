package project.final_project.repository;

import org.springframework.data.domain.Sort;
import project.final_project.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProductRepository extends JpaRepository<Product, Long> {

    // 기존
    List<Product> findByNameContainingIgnoreCase(String keyword);

    // 정렬 포함 검색
    List<Product> findByNameContainingIgnoreCase(String keyword, Sort sort);

}
