const Doctor = require("../models/doctorModel");
const User = require("../models/userModel");
const Notification = require("../models/notificationModel");
const Appointment = require("../models/appointmentModel");

const getalldoctors = async (req, res) => {
  try {
    let docs;
    if (!req.locals) {
      docs = await Doctor.find({ isDoctor: true }).populate("userId");
    } else {
      docs = await Doctor.find({ isDoctor: true })
        .find({
          _id: { $ne: req.locals },
        })
        .populate("userId");
    }

    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get doctors");
  }
};

const getnotdoctors = async (req, res) => {
  try {
    const docs = await Doctor.find({ isDoctor: false })
      .find({
        _id: { $ne: req.locals },
      })
      .populate("userId");

    return res.send(docs);
  } catch (error) {
    res.status(500).send("Unable to get non doctors");
  }
};

const getallapplications = async (req, res) => {
  try {
    console.log("=== Getting all applications ===");

    // Get count of all doctors
    const totalDoctors = await Doctor.countDocuments({});
    console.log("Total doctors in database:", totalDoctors);

    // Get all doctors with isDoctor: false
    const applications = await Doctor.find({ isDoctor: false })
      .populate("userId")
      .sort({ createdAt: -1 });

    console.log("Pending applications found:", applications.length);

    // Get all doctors regardless of status for debugging
    const allDoctorsDebug = await Doctor.find({}).select(
      "userId isDoctor specialization experience fees"
    );
    console.log(
      "All doctors in DB (for debug):",
      JSON.stringify(allDoctorsDebug, null, 2)
    );

    return res.status(200).send(applications);
  } catch (error) {
    console.error("Error fetching applications:", error);
    res.status(500).send("Unable to get applications");
  }
};

const applyfordoctor = async (req, res) => {
  try {
    console.log("=== Apply for Doctor Request ===");
    console.log("userId:", req.locals);
    console.log("Request body:", req.body);

    const alreadyFound = await Doctor.findOne({ userId: req.locals });
    if (alreadyFound) {
      console.log("Application already exists for this user");
      console.log("Existing app isDoctor:", alreadyFound.isDoctor);
      return res
        .status(400)
        .send("You have already applied. Use 'Update Application' instead.");
    }

    // Create new doctor application with isDoctor: false (pending)
    const doctorData = {
      ...req.body,
      userId: req.locals,
      isDoctor: false, // Explicitly set to false for pending applications
    };

    console.log(
      "Creating new application with data:",
      JSON.stringify(doctorData, null, 2)
    );
    const doctor = new Doctor(doctorData);
    const result = await doctor.save();

    console.log("✅ Doctor application saved successfully");
    console.log("Doctor ID:", result._id);
    console.log("isDoctor field:", result.isDoctor);

    return res.status(201).send("Application submitted successfully");
  } catch (error) {
    console.error("❌ Apply for doctor error:", error.message);
    console.error("Full error:", error);
    res.status(500).send("Unable to submit application: " + error.message);
  }
};

const acceptdoctor = async (req, res) => {
  try {
    console.log("=== Approving Doctor Application ===");
    console.log("userId:", req.body.id);

    const user = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: true, status: "accepted" },
      { new: true }
    );

    if (!user) {
      console.log("User not found:", req.body.id);
      return res.status(404).send("User not found");
    }
    console.log("✅ User updated:", user._id);

    const doctor = await Doctor.findOneAndUpdate(
      { userId: req.body.id },
      { isDoctor: true },
      { new: true }
    );

    if (!doctor) {
      console.log("Doctor record not found for userId:", req.body.id);
      return res.status(404).send("Doctor record not found");
    }
    console.log("✅ Doctor updated:", doctor._id);

    const notification = new Notification({
      userId: req.body.id,
      content: `Congratulations, Your application has been accepted.`,
    });

    await notification.save();
    console.log("✅ Notification sent");

    return res.status(200).send("Application accepted successfully");
  } catch (error) {
    console.error("❌ Error approving doctor:", error.message);
    res.status(500).send("Error while approving application: " + error.message);
  }
};

const rejectdoctor = async (req, res) => {
  try {
    console.log("=== Rejecting Doctor Application ===");
    console.log("userId:", req.body.id);

    const details = await User.findOneAndUpdate(
      { _id: req.body.id },
      { isDoctor: false, status: "rejected" },
      { new: true }
    );

    if (!details) {
      console.log("User not found:", req.body.id);
      return res.status(404).send("User not found");
    }
    console.log("✅ User updated:", details._id);

    const delDoc = await Doctor.findOneAndDelete({ userId: req.body.id });
    console.log("✅ Doctor record deleted");

    const notification = new Notification({
      userId: req.body.id,
      content: `Sorry, Your application has been rejected.`,
    });

    await notification.save();
    console.log("✅ Rejection notification sent");

    return res.status(200).send("Application rejected successfully");
  } catch (error) {
    console.error("❌ Error rejecting doctor:", error.message);
    res.status(500).send("Error while rejecting application: " + error.message);
  }
};

const deletedoctor = async (req, res) => {
  try {
    const result = await User.findByIdAndUpdate(req.body.userId, {
      isDoctor: false,
    });
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.send("Doctor deleted successfully");
  } catch (error) {
    console.log("error", error);
    res.status(500).send("Unable to delete doctor");
  }
};

const getmydoctorprofile = async (req, res) => {
  try {
    console.log("Getting doctor profile for userId:", req.locals);

    const doctor = await Doctor.findOne({ userId: req.locals }).populate(
      "userId"
    );

    if (!doctor) {
      console.log("Doctor profile not found for userId:", req.locals);
      return res.status(404).send(null);
    }

    console.log("Doctor profile found:", doctor._id);
    return res.status(200).send(doctor);
  } catch (error) {
    console.error("Error fetching doctor profile:", error);
    res.status(500).send("Unable to fetch doctor profile");
  }
};

const updatedoctorprofile = async (req, res) => {
  try {
    console.log("Update profile - req.locals:", req.locals);

    const doctor = await Doctor.findOne({ userId: req.locals });

    if (!doctor) {
      console.error("Doctor not found for userId:", req.locals);
      return res.status(404).send("Doctor profile not found");
    }

    const updatedDoctor = await Doctor.findOneAndUpdate(
      { userId: req.locals },
      {
        specialization: req.body.specialization,
        experience: req.body.experience,
        fees: req.body.fees,
      },
      { new: true }
    ).populate("userId");

    return res.status(200).send({
      message: "Doctor profile updated successfully",
      doctor: updatedDoctor,
    });
  } catch (error) {
    console.error("Update doctor profile error:", error);
    res.status(500).send("Unable to update doctor profile");
  }
};

module.exports = {
  getalldoctors,
  getnotdoctors,
  getallapplications,
  deletedoctor,
  applyfordoctor,
  acceptdoctor,
  rejectdoctor,
  getmydoctorprofile,
  updatedoctorprofile,
};
