export class ViewAttendance {
  constructor({
    _id = '',
    monthlyAttendance = 0,
    absentDays = 0,
    workingHours = [],
  } = {}) {
    this._id = _id;
    this.monthlyAttendance = monthlyAttendance;
    this.absentDays = absentDays;
    this.workingHours = workingHours.map(date => new Date(date));
  }

  static fromJson(json) {
    return new ViewAttendance(json);
  }

  toJson() {
    return {
      _id: this._id,
      monthlyAttendance: this.monthlyAttendance,
      absentDays: this.absentDays,
      workingHours: this.workingHours.map(date => date.toISOString()),
    };
  }
}
