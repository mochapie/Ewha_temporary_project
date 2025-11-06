package project.final_project.dto;

import java.util.List;

public class SignupRequest {

    private String nickname;
    private Integer age;
    private String gender;
    private String username;
    private String password;
    private List<String> allergies;
    private List<String> medicalConditions;
    private List<IngredientPreference> ingredients;

    // 내부 클래스
    public static class IngredientPreference {
        private String ingredient;
        private String direction;

        public String getIngredient() { return ingredient; }
        public void setIngredient(String ingredient) { this.ingredient = ingredient; }

        public String getDirection() { return direction; }
        public void setDirection(String direction) { this.direction = direction; }
    }

    // --- Getter / Setter ---
    public String getNickname() { return nickname; }
    public void setNickname(String nickname) { this.nickname = nickname; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getUsername() { return username; }
    public void setUsername(String username) { this.username = username; }

    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }

    public List<String> getAllergies() { return allergies; }
    public void setAllergies(List<String> allergies) { this.allergies = allergies; }

    public List<String> getMedicalConditions() { return medicalConditions; }
    public void setMedicalConditions(List<String> medicalConditions) { this.medicalConditions = medicalConditions; }

    public List<IngredientPreference> getIngredients() { return ingredients; }
    public void setIngredients(List<IngredientPreference> ingredients) { this.ingredients = ingredients; }
}
