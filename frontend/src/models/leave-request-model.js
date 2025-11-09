// models/LeaveRequest.js

export class LeaveRequest {
  constructor({
    _id = '',
    employeeId = '',
    employeeName = '',
    startDate = new Date(),
    endDate = new Date(),
    reason = '',
    explainReason = '',
    status = false,
  } = {}) {
    this._id = _id;
    this.employeeId = employeeId;
    this.employeeName = employeeName;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
    this.reason = reason;
    this.explainReason = explainReason;
    this.status = status;
  }

  static fromJson(json) {
    return new LeaveRequest(json);
  }

  toJson() {
    return {
      _id: this._id,
      employeeId: this.employeeId,
      employeeName: this.employeeName,
      startDate: this.startDate.toISOString(),
      endDate: this.endDate.toISOString(),
      reason: this.reason,
      explainReason: this.explainReason,
      status: this.status,
    };
  }
}
