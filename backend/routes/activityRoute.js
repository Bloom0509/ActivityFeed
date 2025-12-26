const express = require("express");
const { createActivity, getActivities} = require("../controllers/activityController");

const router = express.Router();

router.post("/activities", createActivity);
router.get("/activities", getActivities);

module.exports = router;
