package project.final_project.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import project.final_project.entity.UserPrivate;
import java.util.Optional;

public interface UserPrivateRepository extends JpaRepository<UserPrivate, Long> {
    Optional<UserPrivate> findByUsername(String username);
}
