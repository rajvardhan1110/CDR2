// routes/domainRoutes.js
const express = require("express");
const router = express.Router();
const Domain = require("../models/Domain");

// Get all domains
router.get("/", async (req, res) => {
  const domains = await Domain.find();
  res.json(domains);
});

// Get questions by domain
router.get("/:domain", async (req, res) => {
  const domain = await Domain.findOne({ domain: req.params.domain });
  res.json(domain);
});

// Get single question by question ID
router.get("/question/:id", async (req, res) => {
  const domain = await Domain.findOne({ "questions.id": req.params.id });
  const question = domain.questions.find(q => q.id === req.params.id);
  res.json(question);
});

module.exports = router;
