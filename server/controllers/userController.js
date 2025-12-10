const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const Doctor = require("../models/doctorModel");
const Appointment = require("../models/appointmentModel");
const nodemailer = require("nodemailer");
require("dotenv").config();

const getuser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    return res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Unable to get user" });
  }
};

const getallusers = async (req, res) => {
  try {
    const users = await User.find()
      .find({ _id: { $ne: req.locals } })
      .select("-password");
    return res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Unable to get all users" });
  }
};

const login = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (!emailPresent) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }
    if (emailPresent.role != req.body.role) {
      return res.status(404).json({ message: "Role does not exist" });
    }
    const verifyPass = await bcrypt.compare(
      req.body.password,
      emailPresent.password
    );
    if (!verifyPass) {
      return res.status(400).json({ message: "Incorrect credentials" });
    }
    const token = jwt.sign(
      {
        userId: emailPresent._id,
        isAdmin: emailPresent.isAdmin,
        role: emailPresent.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "2 days",
      }
    );
    return res
      .status(201)
      .json({ message: "User logged in successfully", token });
  } catch (error) {
    res.status(500).json({ message: "Unable to login user" });
  }
};

const register = async (req, res) => {
  try {
    const emailPresent = await User.findOne({ email: req.body.email });
    if (emailPresent) {
      return res.status(400).json({ message: "Email already exists" });
    }
    const hashedPass = await bcrypt.hash(req.body.password, 10);
    const user = new User({ ...req.body, password: hashedPass });
    const result = await user.save();
    if (!result) {
      return res.status(500).json({ message: "Unable to register user" });
    }
    return res
      .status(201)
      .json({ message: "User registered successfully", user: result });
  } catch (error) {
    console.error("Register error:", error);
    res
      .status(500)
      .json({ message: "Unable to register user", error: error.message });
  }
};

const updateprofile = async (req, res) => {
  try {
    const updateData = { ...req.body };

    // Only hash password if provided
    if (req.body.password) {
      const hashedPass = await bcrypt.hash(req.body.password, 10);
      updateData.password = hashedPass;
    } else {
      // Don't update password if not provided
      delete updateData.password;
    }

    const result = await User.findByIdAndUpdate(
      { _id: req.locals },
      updateData,
      { new: true }
    );
    if (!result) {
      return res.status(500).json({ message: "Unable to update user" });
    }
    return res.status(201).json({ message: "User updated successfully" });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Unable to update user" });
  }
};
const changepassword = async (req, res) => {
  try {
    console.log(req.body);
    const { userId, currentPassword, newPassword, confirmNewPassword } =
      req.body;
    // console.log("Received newPassword:", newPassword);
    if (newPassword !== confirmNewPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const isPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Incorrect current password" });
    }

    const saltRounds = 10;
    // console.log("Using saltRounds:", saltRounds);

    const hashedNewPassword = await bcrypt.hash(newPassword, saltRounds);
    // console.log("Hashed new password:", hashedNewPassword);

    user.password = hashedNewPassword;
    await user.save();

    return res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const deleteuser = async (req, res) => {
  try {
    const result = await User.findByIdAndDelete(req.body.userId);
    const removeDoc = await Doctor.findOneAndDelete({
      userId: req.body.userId,
    });
    const removeAppoint = await Appointment.findOneAndDelete({
      userId: req.body.userId,
    });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Unable to delete user" });
  }
};

const forgotpassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    // console.log(user,email);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1m",
    });
    // console.log(token)
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: "tarun.kumar.csbs25@heritageit.edu.in",
        pass: "qfhv wohg gjtf ikvz",
      },
    });
    // console.log(transporter);

    const mailOptions = {
      from: "tarun.kumar.csbs25@heritageit.edu.in",
      to: email,
      subject: "Reset Password Link",
      text: `https://appointmentdoctor.netlify.app/resetpassword/${user._id}/${token}`,
    };
    // console.log(mailOptions);

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log(error);
        return res.status(500).json({ message: "Error sending email" });
      } else {
        return res.status(200).json({ message: "Email sent successfully" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const resetpassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const { password } = req.body;
    // console.log(token)
    // console.log(password);
    jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        console.log(err);
        return res.status(400).json({ message: "Invalid or expired token" });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        return res.status(200).json({ message: "Password reset successfully" });
      } catch (updateError) {
        console.error("Error updating password:", updateError);
        return res.status(500).json({ message: "Failed to update password" });
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getuser,
  getallusers,
  login,
  register,
  updateprofile,
  deleteuser,
  changepassword,
  forgotpassword,
  resetpassword,
};
