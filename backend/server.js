const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const authRouter = require("./routes/auth");
const testRouter = require("./routes/test");
const domainRoutes = require("./routes/domain")
const adminRoutes = require("./routes/admin")

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(express.json());

connectDB();

app.use("/api/auth", authRouter);
app.use("/api/test", testRouter);
app.use("/api/domains", domainRoutes);
app.use("/api/admin", adminRoutes);


app.get("/", (req, res) => res.json({ message: "CDR backend (MongoDB) running" }));

app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
