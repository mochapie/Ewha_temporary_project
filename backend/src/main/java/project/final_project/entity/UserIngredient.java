package project.final_project.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;

@Entity
@Table(name = "user_ingredients")
public class UserIngredient {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "preference_id")
    private Long preferenceId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference // 🔹 무한 순환 방지 (UserPrivate의 ManagedReference와 연결)
    private UserPrivate user;

    @Column(name = "ingredient")
    private String ingredient;

    @Column(name = "direction")
    private String direction;

    // --- Getter / Setter ---
    public Long getPreferenceId() { return preferenceId; }
    public void setPreferenceId(Long preferenceId) { this.preferenceId = preferenceId; }

    public UserPrivate getUser() { return user; }
    public void setUser(UserPrivate user) { this.user = user; }

    public String getIngredient() { return ingredient; }
    public void setIngredient(String ingredient) { this.ingredient = ingredient; }

    public String getDirection() { return direction; }
    public void setDirection(String direction) { this.direction = direction; }

    // --- Optional: toString() (디버깅용) ---
    @Override
    public String toString() {
        return "UserIngredient(preferenceId=" + preferenceId + ", ingredient=" + ingredient + ")";
    }
}
