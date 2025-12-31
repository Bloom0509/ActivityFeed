const express = require("express");
const { createActivity, getActivities,checkHeaderMiddleware} = require("../controllers/activityController");

const router = express.Router();

router.post("/activities",checkHeaderMiddleware, createActivity);
router.get("/activities", checkHeaderMiddleware,getActivities);

module.exports = router;
