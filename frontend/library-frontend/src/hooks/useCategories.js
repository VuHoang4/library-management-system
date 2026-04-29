import { useState, useEffect } from "react";
import { categoryApi } from "../services/categoryApi"; 

export const useCategories = () => {
  const [categories, setCategories] = useState([{ id: "all", name: "Tất cả" }]);
  const [isCatLoading, setIsCatLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCatLoading(true);
      try {
        const response = await categoryApi.getAll(); 
        
        const data = response.data || response; 
        
        setCategories([{ id: "all", name: "Tất cả" }, ...data]);
      } catch (error) {
        console.error("Lỗi khi fetch danh mục:", error);
      } finally {
        setIsCatLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, isCatLoading };
};