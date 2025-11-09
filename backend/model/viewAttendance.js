const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// ✅ عرّف سكيمه منفصلة أولاً
const workingHourSchema = new Schema({
  date: {
    type: Date,
    required: true,
  },
  hours: {
    type: Number,
    required: true,
  },
});

// ✅ سكيمه الحضور الرئيسي
const viewAttendance = new Schema({
  monthlyAttendance: {
    type: Number,
  },
  absentDays: {
    type: Number,
  },
  workingHours: [workingHourSchema], // استخدم السكيمه بعد تعريفها
});

module.exports = viewAttendance;
