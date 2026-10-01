import app from "./app.js";
import { connectDB } from "./config/db.js";
import { startAutomationWorker } from "./services/automationWorker.js";

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Start Automation Background Worker Loop
startAutomationWorker(60000);

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});


