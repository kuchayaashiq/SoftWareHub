const express = require("express");
const router = express.Router();
const Note = require("../models/Note");
var fetchuser = require("../middleware/fetchuser");
const { body, validationResult } = require("express-validator");

//ROUTE 1: Add a New Note using POST: /api/notes/addnotes .Login required
router.post(
  "/addnote",
  fetchuser,
  [
    // checking the validation of feilds
    // Title must be at least 3 chars long
    body("title", "Enter a valid title").isLength({ min: 3 }),
    // Description must be at least 5 chars long
    body("description", "Description must be atleast 6 characters").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    try {
      const { title, description, tag } = req.body;
      //check if there is any error and bad request.
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const note = new Note({
        title,
        description,
        tag,
        user: req.user.id,
      });
      const savedNote = await note.save();
      res.json(savedNote);
    } catch (error) {
      console.log(error);
      res.status(500).send({ error: "Internal server error" });
    }
  }
);
//ROUTE 2: Get all notes using GET: /api/notes/fetchallnotes .Login required
router.get("/fetchallnotes", fetchuser, async (req, res) => {
  try {
    const notes = await Note.find({ user: req.user.id });
    res.json(notes);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//ROUTE 3:Update an existing Note using PUT: /api/notes/updatenote .Login required
router.put("/updatenote/:id", fetchuser, async (req, res) => {
  const { title, description, tag } = req.body;
  try {
    const newNote = {};
    if (title) {
      newNote.title = title;
    }
    if (description) {
      newNote.description = description;
    }
    if (tag) {
      newNote.tag = tag;
    }
    //find the note to be updated and update it
    let note = await Note.findById(req.params.id);
    if (!note) {
      // if note doesnot exists
      return res.status(404).send("Not Found");
    }
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndUpdate(
      req.params.id,
      { $set: newNote },
      { new: true }
    );
    res.json(note);
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});

//ROUTE 4: Delete an existing Note using Delete: /api/notes/deletenote .Login required
router.delete("/deletenote/:id", fetchuser, async (req, res) => {
  try {
    //find the note to be deleted and delete it
    let note = await Note.findById(req.params.id);
    // if note doesnot exists
    if (!note) {
      return res.status(404).send("Not Found");
    }
    //allow deletion only if user owns this note
    if (note.user.toString() !== req.user.id) {
      return res.status(401).send("Not Allowed");
    }
    note = await Note.findByIdAndDelete(req.params.id);
    res.json({ Success: "Note has been deleted successfully", note: note });
  } catch (error) {
    console.log(error);
    res.status(500).send({ error: "Internal server error" });
  }
});
module.exports = router;
