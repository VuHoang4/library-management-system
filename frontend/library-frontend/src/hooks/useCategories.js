import { useState, useEffect } from "react";
import { categoryApi } from "../services/categoryApi"; 

export const useCategories = () => {
  const [categories, setCategories] = useState([{ id: "all", name: "Tất cả" }]);
  const [isCatLoading, setIsCatLoading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      setIsCatLoading(true);
      try {
        // Chỉ cần gọi hàm, không cần quan tâm đến URL hay cấu hình Header ở đây nữa
        const response = await categoryApi.getCategories(); 
        
        // Nhớ check xem cấu trúc response của axios trả về nhé (thường data nằm trong response.data)
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