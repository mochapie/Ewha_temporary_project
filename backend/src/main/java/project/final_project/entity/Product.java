package project.final_project.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "ramen_db")   // DB는 ramen_db, 테이블은 ramen_products
public class Product {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "`품명`")
    private String name;

    @Column(name = "`브랜드`")
    private String brand;

    @Column(name = "`상품이미지링크`", columnDefinition = "TEXT")
    private String imageUrl;

    @Column(name = "`알레르기`", columnDefinition = "TEXT")
    private String allergy;

    @Column(name = "`간접알레르기`", columnDefinition = "TEXT")
    private String indirectAllergy;

    @Column(name = "`총내용량`")
    private String totalWeight;

    @Column(name = "`개별내용량`")
    private String unitWeight;

    @Column(name = "`칼로리`")
    private String calories;

    @Column(name = "`나트륨`")
    private String sodium;

    @Column(name = "`탄수화물`")
    private String carbohydrate;

    @Column(name = "`당류`")
    private String sugar;

    @Column(name = "`지방`")
    private String fat;

    @Column(name = "`트랜스지방`")
    private String transFat;

    @Column(name = "`포화지방`")
    private String saturatedFat;

    @Column(name = "`콜레스테롤`")
    private String cholesterol;

    @Column(name = "`단백질`")
    private String protein;

    public Product() {}

    // --- Getters / Setters (Lombok 미사용) ---
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getBrand() { return brand; }
    public void setBrand(String brand) { this.brand = brand; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getAllergy() { return allergy; }
    public void setAllergy(String allergy) { this.allergy = allergy; }

    public String getIndirectAllergy() { return indirectAllergy; }
    public void setIndirectAllergy(String indirectAllergy) { this.indirectAllergy = indirectAllergy; }

    public String getTotalWeight() { return totalWeight; }
    public void setTotalWeight(String totalWeight) { this.totalWeight = totalWeight; }

    public String getUnitWeight() { return unitWeight; }
    public void setUnitWeight(String unitWeight) { this.unitWeight = unitWeight; }

    public String getCalories() { return calories; }
    public void setCalories(String calories) { this.calories = calories; }

    public String getSodium() { return sodium; }
    public void setSodium(String sodium) { this.sodium = sodium; }

    public String getCarbohydrate() { return carbohydrate; }
    public void setCarbohydrate(String carbohydrate) { this.carbohydrate = carbohydrate; }

    public String getSugar() { return sugar; }
    public void setSugar(String sugar) { this.sugar = sugar; }

    public String getFat() { return fat; }
    public void setFat(String fat) { this.fat = fat; }

    public String getTransFat() { return transFat; }
    public void setTransFat(String transFat) { this.transFat = transFat; }

    public String getSaturatedFat() { return saturatedFat; }
    public void setSaturatedFat(String saturatedFat) { this.saturatedFat = saturatedFat; }

    public String getCholesterol() { return cholesterol; }
    public void setCholesterol(String cholesterol) { this.cholesterol = cholesterol; }

    public String getProtein() { return protein; }
    public void setProtein(String protein) { this.protein = protein; }
}
