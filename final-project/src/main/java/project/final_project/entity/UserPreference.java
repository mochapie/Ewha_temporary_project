package project.final_project.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "user_preference")
public class UserPreference {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String username; // 사용자 이름 또는 아이디

    @Column(name = "allergy", columnDefinition = "TEXT")
    private String allergy; // 콤마로 구분된 기피 알레르기

    @Column(name = "indirect_allergy", columnDefinition = "TEXT")
    private String indirectAllergy; // 기피 간접알레르기

    public UserPreference() {}

    // getter / setter
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getAllergy() { return allergy; }
    public void setAllergy(String allergy) { this.allergy = allergy; }

    public String getIndirectAllergy() { return indirectAllergy; }
    public void setIndirectAllergy(String indirectAllergy) { this.indirectAllergy = indirectAllergy; }
}
