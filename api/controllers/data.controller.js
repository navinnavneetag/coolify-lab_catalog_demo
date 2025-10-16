import { dataService } from "../services/data.service.js";

export const insertData = async (req, res) => {
  const data = await dataService.insertData(req.body);

  res.status(201).json({
    message: "Data inserted successfully",
    data,
  });
};

export const getDashboardStats = async (req, res) => {
  const data = await dataService.getDashboardStats();
  res.json({
    success: true,
    data,
  });
};

export const postDashboardStats = async (req, res) => {
  const data = await dataService.getFilteredDashboardStats(req.body);
  res.json({
    success: true,
    data,
  });
};

export const downloadLabData = async (req, res) => {
  const { labs, filterBody } = req.body;
  const data = await dataService.downloadLabData(labs, filterBody);
  res.json({
    success: true,
    data,
  });
};
