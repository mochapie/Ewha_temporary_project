package project.final_project.entity;

import jakarta.persistence.*;

@Entity
public class UserPreference {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username;       // 사용자명
    private String avoidIngredient; // 피해야 할 원재료

    public UserPreference() {}

    public UserPreference(String username, String avoidIngredient) {
        this.username = username;
        this.avoidIngredient = avoidIngredient;
    }

    public String getUsername() { return username; }
    public String getAvoidIngredient() { return avoidIngredient; }
}
