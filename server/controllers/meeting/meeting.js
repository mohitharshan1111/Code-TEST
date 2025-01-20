const MeetingHistory = require("../../model/schema/meeting");

const add = async (req, res) => {
  try {
    req.body.createdDate = new Date();
    console.log(req.body);
    const meeting = new MeetingHistory(req.body);
    await meeting.save();
    res.status(200).json(meeting);
  } catch (err) {
    console.error("Failed to create Meeting:", err);
    res.status(400).json({ error: "Failed to create Meeting" });
  }
};

const index = async (req, res) => {
  const query = req.query;
  query.deleted = false;

  let allData = await MeetingHistory.find(query)
    .populate({
      path: "createBy",
      match: { deleted: false },
    })
    .exec();

  const result = allData.filter((item) => item.createBy !== null);
  res.send(result);
};

const view = async (req, res) => {
  let meeting = await MeetingHistory.findOne({ _id: req.params.id })
    .populate("createBy", "firstName lastName")
    .populate("attendes", "firstName lastName");
  if (!meeting) return res.status(404).json({ message: "no Data Found." });
  res.status(200).json(meeting);
};

const deleteData = async (req, res) => {
  try {
    const meeting = await MeetingHistory.findByIdAndUpdate(req.params.id, {
      deleted: true,
    });
    res.status(200).json({ message: "done", meeting });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

const deleteMany = async (req, res) => {
  try {
    const meeting = await MeetingHistory.updateMany(
      { _id: { $in: req.body } },
      { $set: { deleted: true } }
    );
    res.status(200).json({ message: "done", meeting });
  } catch (err) {
    res.status(404).json({ message: "error", err });
  }
};

module.exports = { add, index, view, deleteData, deleteMany };
