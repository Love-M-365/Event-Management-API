const express = require("express");
const router = express.Router();
const controller = require("../controllers/eventControllers");

router.post("/events", controller.createEvent);
router.get("/events/:id", controller.getEventDetails);
router.post("/events/register", controller.registerForEvent);
router.post("/events/cancel", controller.cancelRegistration);
router.get("/events/upcoming", controller.listUpcomingEvents);
router.get("/events/:id/stats", controller.eventStats);

module.exports = router;
