const express = require("express");
const doctorController = require("../controllers/doctorController");
const auth = require("../middleware/auth");

const doctorRouter = express.Router();

doctorRouter.get("/getalldoctors", doctorController.getalldoctors);

doctorRouter.get("/getnotdoctors", auth, doctorController.getnotdoctors);

doctorRouter.get(
  "/getallapplications",
  auth,
  doctorController.getallapplications
);

doctorRouter.get(
  "/getmydoctorprofile",
  auth,
  doctorController.getmydoctorprofile
);

doctorRouter.post("/applyfordoctor", auth, doctorController.applyfordoctor);

doctorRouter.put(
  "/updatedoctorprofile",
  auth,
  doctorController.updatedoctorprofile
);

doctorRouter.put("/deletedoctor", auth, doctorController.deletedoctor);

doctorRouter.put("/acceptdoctor", auth, doctorController.acceptdoctor);

doctorRouter.put("/approveddoctor", auth, doctorController.acceptdoctor);

doctorRouter.put("/rejectdoctor", auth, doctorController.rejectdoctor);

doctorRouter.put("/rejectedapplication", auth, doctorController.rejectdoctor);

module.exports = doctorRouter;
