const dashboardService = require("../services/dashboardService");

const getDashboard = async (req, res) => {
    try {
        const data = await dashboardService.getDashboard();
        res.status(200).json(data);
    } catch (error) {
        console.error("Dashboard Error:", error.message);
        res.status(500).json({ message: "Failed to load dashboard", error: error.message });
    }
};

module.exports = { getDashboard };
