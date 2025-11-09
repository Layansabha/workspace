// models/Employee.js
import { LeaveRequest } from './leave-request-model';
import { ViewAttendance } from './view-attendence';

export class Employee {
  constructor({
    _id = '',
    name = '',
    email = '',
    password = '',
    department = '',
    position = '',
    phoneNumber = '',
    dateOfBirth = new Date(),
    loginCredentials = '',
    salary = 0,
    status = 0,
    leaveRequest = {},
    viewAttendance = {},
    role = '',
    gender = '',
  } = {}) {
    this._id = _id;
    this.name = name;
    this.email = email;
    this.password = password;
    this.department = department;
    this.position = this.formatPosition(position); // ✅ تحسين المسمى الوظيفي
    this.phoneNumber = phoneNumber;
    this.dateOfBirth = new Date(dateOfBirth);
    this.loginCredentials = loginCredentials;
    this.salary = salary;
    this.status = this.convertStatus(status); // ✅ تحويل الحالة لنص قابل للعرض
    this.leaveRequest = new LeaveRequest(leaveRequest);
    this.viewAttendance = new ViewAttendance(viewAttendance);
    this.role = role;
    this.gender = gender;
  }

  static fromJson(json) {
    return new Employee(json);
  }

  toJson() {
    return {
      _id: this._id,
      name: this.name,
      email: this.email,
      password: this.password,
      department: this.department,
      position: this.position,
      phoneNumber: this.phoneNumber,
      dateOfBirth: this.dateOfBirth.toISOString(),
      loginCredentials: this.loginCredentials,
      salary: this.salary,
      status: this.status,
      leaveRequest: this.leaveRequest.toJson(),
      viewAttendance: this.viewAttendance.toJson(),
      role: this.role,
      gender: this.gender,
    };
  }

  // ✅ تحويل حالة الموظف إلى نص واضح
  convertStatus(status) {
    switch (status) {
      case 0:
        return 'Active';
      case 1:
        return 'On Leave';
      case 2:
        return 'Inactive';
      default:
        return 'Unknown';
    }
  }

  // ✅ تنسيق المسمى الوظيفي بدون كلمة "manager" إن لزم
  formatPosition(position) {
    if (!position) return 'Employee';
    const cleaned = position.replace(/manager/gi, '').trim();
    return cleaned || 'Employee';
  }

  // ✅ دالة لحساب العمر
  getAge() {
    const today = new Date();
    let age = today.getFullYear() - this.dateOfBirth.getFullYear();
    const m = today.getMonth() - this.dateOfBirth.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < this.dateOfBirth.getDate())) {
      age--;
    }
    return age;
  }
}
