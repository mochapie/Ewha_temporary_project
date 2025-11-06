package project.final_project.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.util.List;

@Entity
@Table(name = "user_private")
@JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 🔹 Hibernate 프록시 무시
public class UserPrivate {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Long userId;

    @Column(name = "nickname", length = 50, unique = true)
    private String nickname;

    @Column(name = "username", length = 50, unique = true)
    private String username;

    @Column(name = "password_hash", length = 100)
    private String passwordHash;

    @Column(name = "age")
    private Integer age;

    @Column(name = "gender", columnDefinition = "ENUM('Male','Female','Other','Prefer Not To Say')")
    private String gender;

    @Column(name = "allergies", columnDefinition = "TEXT")
    private String allergies;

    @Column(name = "medical_conditions", columnDefinition = "TEXT")
    private String medicalConditions;

    // 🔗 1:N 관계 설정 — ingredients (UserIngredient)
    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    @JsonManagedReference // 🔹 순환 참조 방지 (UserIngredient 쪽에서 BackReference로 닫음)
    private List<UserIngredient> ingredients;

    // --- Getter / Setter ---
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }

    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getAllergies() { return allergies; }
    public void setAllergies(String allergies) { this.allergies = allergies; }

    public String getMedicalConditions() { return medicalConditions; }
    public void setMedicalConditions(String medicalConditions) { this.medicalConditions = medicalConditions; }

    public List<UserIngredient> getIngredients() { return ingredients; }
    public void setIngredients(List<UserIngredient> ingredients) { this.ingredients = ingredients; }

    // --- Optional: 디버깅용 간단 toString() ---
    @Override
    public String toString() {
        return "UserPrivate(userId=" + userId + ", username=" + username + ")";
    }
}
