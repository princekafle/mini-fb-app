import User from '../models/Usermodel.js';
import uploadFile from '../utils/file.js';
import formatUserdata from "../helpers/dataFormatter.js";

// CREATE USER
const createUser = async (req, res) => {
  try {
    const user = await User.create(req.body);
    res.json(user);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// DELETE USER
const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: `User deleted successfully of id: ${req.params.id}` });
  } catch (error) {
    res.status(500).send(error.message);
  }
};

// GET ALL USERS
const getallusers = async (req, res) => {
  try {
    const users = await User.find();
    const formattedUsers = users.map((user) => formatUserdata(user));
    res.json(formattedUsers);
  } catch (error) {
    res.status(500).send(error.message);
  }
};

const updateUser = async (req, res) => {
    const userId = req.params.id;
    const updates = req.body;
  
    try {
      const updatedUser = await User.findByIdAndUpdate(userId, updates, {
        new: true,
      });
  
      if (!updatedUser) {
        return res.status(404).send("User not found");
      }
  
      res.json(formatUserdata(updatedUser));
    } catch (error) {
      res.status(500).send(error.message);
    }
};
  


// UPLOAD PROFILE IMAGE
const uploadProfileImage = async (req, res) => {
  const file = req.file;
  const userId = req.user.id;

  try {
    const uploadedFiles = await uploadFile([file]);

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        profileImageUrl: uploadedFiles[0]?.url,
      },
      { new: true }
    );

    res.json(formatUserdata(updatedUser));
  } catch (error) {
    res.status(500).send(error.message);
  }
};

export { createUser, deleteUser, getallusers, updateUser, uploadProfileImage };






















