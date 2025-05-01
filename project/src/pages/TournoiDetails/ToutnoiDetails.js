import React, { useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AddCategoryModal from "./Components/AddCategoryModal"; // make sure path is correct

const TournoiDetails = () => {
  const { id: tournamentId } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddCategory = () => {
    setIsModalOpen(true);
  };

  const handleCategorySubmit = async (categoryData) => {
    try {
      const payload = {
        rank: categoryData.grades,
        gender: categoryData.gender,
        weight_category_id: categoryData.weight_category_id,
        elimination_type: "Directe",
        age_group_id: categoryData.age_group_id
      };

      console.log("Sending payload:", payload);

      await axios.post(`http://localhost:3000/tournaments/${tournamentId}/categories`, payload);
      alert("✅ Catégorie ajoutée avec succès !");
    } catch (error) {
      console.error("❌ Erreur lors du POST :", error.response?.data || error.message);
      alert("Erreur serveur. Voir la console.");
    }
    setIsModalOpen(false);
  };

  return (
    <div>
      <button onClick={handleAddCategory}>➕ Ajouter Catégorie</button>
      {/* <button onClick={() => handleCategorySubmit({
        grades: ["Ceinture Blanche"],
        gender: "H",
        weight_category_id: 1,
        age_group_id: 1
      })}>🚀 Tester création catégorie</button> */}

      <AddCategoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCategorySubmit}
      />
    </div>
  );
};

export default TournoiDetails;
