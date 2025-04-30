const Vehicle = require("../Models/vehicles")


exports.enterVehicleDetails = async (req, res) => {
    try {
        const { vehicleNumber} = req.body;

    
        // Insert into database (replace `db` with your actual DB instance)
        const vehicle = new Vehicle({vehicleNumber}); await vehicle.save();

        res.status(201).json({ message: "Vehicle details added successfully", data: vehicle});
    } catch (error) {
        console.error("Error entering vehicle details:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

exports.getLatestVehicles = async (req, res) => {
    try {
        const vehicles = await Vehicle.find().sort({ entryTime: -1 }); // Sort by latest
        res.status(200).json({ message: "Vehicles retrieved successfully", data: vehicles });
    } catch (error) {
        console.error("Error retrieving vehicles:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

