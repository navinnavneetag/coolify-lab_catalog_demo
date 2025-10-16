import axios from "axios";
import config from "@/utils/config";

const apiClient = axios.create({
  baseURL: `${config.API_URL}/data`,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLabData = async () => {
  try {
    const res = await apiClient.get(`/getDashboardStats`);
    return res.data.data;
  } catch (error) {
    console.error("Failed to fetch lab data:", error);
    throw new Error("Failed to fetch lab data");
  }
};

export const postLabData = async (filters = {}) => {
  try {
    const res = await apiClient.post(`/postDashboardStats`, {
      lab_name: filters.lab_name || [],
      main_food_category: filters.main_food_category || [],
      test_sub_category: filters.test_sub_category || [],
      test_category: filters.test_category || [],
      parameter: filters.parameter || [],
      product: filters.product || [],
      region: filters.region || [],
      state: filters.state || [],
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to post lab data:", error);
    throw new Error("Failed to post lab data");
  }
};

export const getDownloadLabData = async (labs, filterBody) => {
  try {
    const res = await apiClient.post(`/downloadLabData`, {
      labs: labs,
      filterBody: filterBody,
    });
    return res.data.data;
  } catch (error) {
    console.error("Failed to download lab data:", error);
    throw new Error("Failed to download lab data");
  }
};
