const Note = require("../models/Notes");
const mongoose = require("mongoose");

exports.dashboard = async (req, res) => {
  let perPage = 12;
  let page = req.query.page || 1;
  const locals = {
    title: "Dashboard",
    description: "Free NodeJs Notes App",
  };

  try {
    // Fetch notes with pagination
    const notes = await Note.aggregate([
      {
        $sort: {
          createdAt: -1,
        },
      },
      { $match: { user: new mongoose.Types.ObjectId(req.user.id) } },
      {
        $project: {
          title: { $substrBytes: ["$title", 0, 30] },
          body: { $substrBytes: ["$body", 0, 100] },
        },
      },
    ])
      .skip(perPage * page - perPage)
      .limit(perPage);

    // Count total notes for pagination
    const count = await Note.countDocuments({
      user: new mongoose.Types.ObjectId(req.user.id),
    });

    // Render the dashboard with notes
    res.render("dashboard/index", {
      userName: req.user.firstName,
      locals,
      notes,
      layout: "layouts/dashboard",
      current: page,
      pages: Math.ceil(count / perPage),
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.dashboardViewNote = async (req, res) => {
  const note = await Note.findById({ _id: req.params.id })
    .where({ user: req.user.id })
    .lean();

  if (note) {
    res.render("dashboard/view-note", {
      noteID: req.params.id,
      note,
      layout: "../views/layouts/dashboard",
    });
  } else {
    res.send("Something went wrong...");
  }
};

exports.dashboardUpdateNote = async (req, res) => {
  try {
    await Note.findOneAndUpdate(
      {
        _id: req.params.id,
      },
      { title: req.body.title, body: req.body.body }
    ).where({ user: req.user.id });

    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.dashboardDeleteNote = async (req, res) => {
  try {
    await Note.deleteOne({ _id: req.params.id }).where({
      user: req.user.id,
    });

    res.redirect("/dashboard");
  } catch (err) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.dashboardAddNote = async (req, res) => {
  res.render("dashboard/add", {
    layout: "layouts/dashboard",
  });
};

exports.dashboardAddNoteSubmit = async (req, res) => {
  try {
    req.body.user = req.user.id;
    await Note.create(req.body);
    res.redirect("/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// get Search
exports.dashboardSearch = async (req, res) => {
  try {
    res.render("dashboard/search", {
      searchResults: "",
      layout: "layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};

exports.dashboardSearchSubmit = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    const searchNoSpecialChars = searchTerm.replace(/[^a-zA-Z0-9]/g, "");

    const searchResults = await Note.find({
      $or: [
        { title: { $regex: new RegExp(searchNoSpecialChars, "i") } },
        { body: { $regex: new RegExp(searchNoSpecialChars, "i") } },
      ],
    }).where({ user: req.user.id });

    res.render("dashboard/search", {
      searchResults,
      layout: "layouts/dashboard",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send("Server Error");
  }
};
