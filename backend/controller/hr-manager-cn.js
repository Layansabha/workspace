
const bcrbt = require('bcryptjs');
const { validationResult } = require('express-validator');
const Employee = require('../model/employee');
const Request = require('../model/leaveRequest');
const Event = require('../model/event');
const {leaveRequest} = require('../model/leaveRequest');

exports.addEmployee = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const errorMessages = errors.array().map((err) => err.msg).join(', ');
      const error = new Error(`Validation failed: ${errorMessages}`);
      error.statusCode = 422;
      error.data = errors.array();
      return next(error);
    }

    const {
      name,
      department,
      position,
      gender,
      salary,
      phoneNumber,
      dateOfBirth,     // ✅ أضفنا هذا
    } = req.body;

    const email = req.body.email?.trim();
    const password = req.body.password?.trim();

    const existEmployee = await Employee.findOne({ email: email });
    const hashPass = await bcrbt.hash(password, 12);

    if (existEmployee) {
      const error = new Error(`email already exist`);
      error.statusCode = 422;
      return next(error);
    }

    let employee = new Employee({
      phoneNumber: phoneNumber,
      salary: salary,
      email: email,
      password: hashPass,
      department: department,
      gender: gender,
      position: position, // هون صار تعديل على الاسم
      name: name,
      dateOfBirth, // ✅ أضفنا هنا
      role: req.body.role || 'employee'  // ✅ تم التعديل هنا
    });

    employee = await employee.save();

    // ✅ تم إضافة هذا الجزء لإنشاء حدث عيد ميلاد تلقائي عند إضافة موظف جديد
    if (employee.dateOfBirth) {
      const currentYear = new Date().getFullYear();
      const originalDate = new Date(employee.dateOfBirth);
      const birthdayThisYear = new Date(currentYear, originalDate.getMonth(), originalDate.getDate());

      await Event.create({
        employeeEmail: employee.email,
        eventType: 'Birthday',
        eventTime: birthdayThisYear,
      });
    }

    return res.status(200).json(employee);
  } catch (err) {  /* هنا صار تعديل  */
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};


exports.updateEmployee = async (req, res, next) => {
  try {
    const {
      email,
      name,
      department,
      position,
      salary,
      phoneNumber,
      dateOfBirth,
      status
    } = req.body;

    const employee = await Employee.findOne({ email: email?.trim() });

    if (!employee) {
      const error = new Error(`There is no employee with this email`);
      error.statusCode = 422;
      return next(error);
    }

    // ✅ فقط الحقول المسموح بتعديلها
    if (name) employee.name = name;
    if (department) employee.department = department;
    if (position) employee.position = position;
    if (phoneNumber) employee.phoneNumber = phoneNumber;
    if (salary !== undefined) employee.salary = salary;

    // ✅ تحويل الحالة من نص إلى رقم
    if (status === 'Active') employee.status = 0;
    else if (status === 'On Leave') employee.status = 1;
    else if (status === 'Inactive') employee.status = 2;

    // ✅ تحديث تاريخ الميلاد إن وجد
    if (dateOfBirth && !isNaN(Date.parse(dateOfBirth))) {
      employee.dateOfBirth = new Date(dateOfBirth);
    }

    // ✅ علاج مشكلة عدم وجود gender أو وجود قيمة غير صالحة
    // ⛔️ لا نسمح بتعديل: email, password, role
if (employee.gender && typeof employee.gender === 'string') {
  employee.gender = employee.gender.toLowerCase();
}

    await employee.save();

    return res.json(employee);
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};




exports.getEmployees= async(req,res,next)=>{
try{
const employees = await Employee.find();
return res.json(employees);

}
catch (err){
    if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
}
};

exports.deleteEmployees= async(req,res,next)=>{
    try{
        const email = req.body.email?.trim();

    const employee = await Employee.findOne({email:email});
    if(!employee){
        const error = new Error(`there is no one with this email`);
      error.statusCode = 422;
      return next(error);
    }
await Employee.findOneAndDelete({email: email});
return res.json({ message: 'User deleted successfully' });

    }
    catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
    };


    exports.getReq= async(req,res,next)=>{
      try{
        const request = await Request.find();
        return res.json(request);

      }
      catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
    };


    // email, status{true or false}, id => update req  => endDate => date.now

    exports.statusOfReq= async(req,res,next)=>{
      try{
        const{status ,_id} = req.body;
        var request = await Request.findById(_id);
        if(!request){
          const error = new Error(`there is no request with this id`);
        error.statusCode = 422;
        return next(error);
      }

      request.status = status;
      request.endDate = Date.now();

      return res.json(request);
        
      }
      catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
    };
    
    exports.getEvent= async(req,res,next)=>{

      try{

        const event = await Event.find();
        return res.json(event);
      }
      catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }


    };

    exports.addEvent = async (req, res, next) => {
      try {
        const { employeeEmail, eventType, eventTime } = req.body;
    
        // التحقق من أن جميع الحقول المطلوبة موجودة
        if (!eventTime || !eventType || !employeeEmail) {
          const error = new Error(`Please fill in all required fields`);
          error.statusCode = 422;
          return next(error);
        }
    
        // ✅ استخدمنا let بدل const لأننا نحتاج لإعادة تعيين المتغير بعد .save()
        let event = new Event({
          employeeEmail: employeeEmail,
          eventType: eventType,
          eventTime: eventTime
        });
    
        event = await event.save(); // ✅ هذا السطر كان يسبب الخطأ لأن const لا تسمح بإعادة التعيين
    
        return res.json(event); // ✅ إرجاع الحدث المضاف للواجهة الأمامية
    
      } catch (err) {
        if (!err.statusCode) {
          err.statusCode = 500;
        }
        next(err); // ✅ تمرير الخطأ إلى middleware الخاص بالتعامل مع الأخطاء
      }
    };
    

    exports.manageDepartment = async (req, res, next) => {
  try {
    const { email, department } = req.body;
    const employee = await Employee.findOne({ email: email });

    if (!employee) {
      const error = new Error(`There is no employee with this email`);
      error.statusCode = 422;
      return next(error);
    }

    // ✅ تحقق إن كان هناك مدير معين بالفعل لهذا القسم
    const existingManager = await Employee.findOne({ department: department, position: 'manager' });

    if (existingManager) {
      const error = new Error(`Department already has a manager assigned: ${existingManager.name}`);
      error.statusCode = 409; // Conflict
      return next(error);
    }

    if (department === "HR") {
      employee.role = "hr manager";
    }

    employee.position = "manager";
    await employee.save();

    return res.json({ message: 'Manager assigned successfully', employee });
  } catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
};



    exports.getReq = async (req, res, next) => {
try{
let getEmployeeReq = leaveRequest.find({status: null});
return res.json(getEmployeeReq);
}
catch (err) {
  if (!err.statusCode) {
    err.statusCode = 500;
  }
  next(err); 
}
    };


    exports.getTodayWorkingEmployees = async (req, res, next) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); // Start of tomorrow

    const employees = await Employee.find({
      workingHours: {
        $elemMatch: {
          $gte: today,
          $lt: tomorrow
        }
      }
    });

    // Optional: format output to show number of working entries today per employee
    const result = employees.map(emp => {
      const todayEntries = emp.workingHours.filter(date => {
        return date >= today && date < tomorrow;
      });

      return {
        _id: emp._id,
        name: emp.name, // assuming there is a name field
        totalEntriesToday: todayEntries.length
      };
    });

    return res.json(result);
  } catch (err) {
    if (!err.statusCode) err.statusCode = 500;
    next(err);
  }
};


exports.changeIntoEmployee = async (req, res, next) => {
  try{
    const {managerId} = req.body;
let manager = await Employee.findById(managerId);
if(manager.position !== "manager"){
      const error = new Error('this employee is not a manager');
        error.statusCode = 401;
        throw error;
}
manager.position = "employee";
manager.role = "employee"
await manager.save();

return res.json(manager);
  }
    catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }   
};
