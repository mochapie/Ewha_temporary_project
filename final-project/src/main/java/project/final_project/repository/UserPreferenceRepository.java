package project.final_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.final_project.entity.UserPreference;

import java.util.Optional;

public interface UserPreferenceRepository extends JpaRepository<UserPreference, Long> {
    Optional<UserPreference> findByUsername(String username);
}