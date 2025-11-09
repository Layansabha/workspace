const Employee = require('../model/employee');
const io = require('../socket');

exports.topFiveEmployee = async (req, res, next) => {
    const {department} = req.params;
try{
    const topEmployee = await Employee.find({department: department}).sort({points:-1}).limit(5);

    return res.json(topEmployee);

}
 catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
};


exports.workingHours = async (req, res, next) => {
try{
   
const {workingHours, _id} = req.body;
let employee = await Employee.findById(_id);

employee.viewAttdendance.workingHours.push(workingHours);

return res.json(workingHours);

}
 catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }

};



exports.addTask = async (req, res, next) => {
    try{
        const {taskId} = req.body;

        if (!req.file) {
          const error = new Error("No file was uploaded");
          error.statusCode = 400;
          throw error;
        }
                const result = req.file.path;

        let employee = await Employee.findById(req.user);
      // Find the task by taskId
const task = employee.task.id(taskId);

if (!task) {
  const error = new Error("Task not found");
  error.statusCode = 404;
  throw error;
}

// Update the result field
task.result = result;

// Save the employee document
await employee.save();

io.getIO().of("/manager").to(task.ManagerId).emit("taskFile", result);
    }
 catch (err) {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);
  }
}

exports.getTasks = async (req, res, next) => {
    try{
        let employee = await Employee.findById(req.user);
        return res.json(employee.task);
    }
     catch (err){
        if (!err.statusCode) {
            err.statusCode = 500;
          }
          next(err);
    }
}




    exports.addEmployeeImage = async (req, res, next) => {
      try {
        const employee = await Employee.findById(req.user);
    
        if (!employee) {
          const error = new Error("employee not found");
          error.statusCode = 401;
          throw error;
        }
    
        if (!req.file) {
          const error = new Error("No image was uploaded");
          error.statusCode = 400;
          throw error;
        }
    
        const imagePath = req.file.path;
    
        // Delete old store image from admin
        if (employee.images && fs.existsSync(employee.images)) {
          fs.unlinkSync(employee.images);
        }
    
    
    
        // Set new image on admin
        employee.images = imagePath;
        await employee.save();
    
        return res.json(imagePath);
      } catch (err) {
        if (!err.statusCode) err.statusCode = 500;
        next(err);
      }
    };