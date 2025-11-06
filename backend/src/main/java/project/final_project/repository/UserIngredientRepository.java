package project.final_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.final_project.entity.UserIngredient;

public interface UserIngredientRepository extends JpaRepository<UserIngredient, Long> {}
