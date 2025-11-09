const Employee = require("../model/employee");
const {leaveRequest} = require('../model/leaveRequest');
const isManager = require('../socket-middleware/is-auth');
const {Task} = require("../model/task");

const employeeSocket = (io) => {
    io.of("/manager").use(isManager).on("connection",(socket)=>{
        console.log('Admin connected:', socket.employee.id);

        socket.join(socket.employee.id);

        socket.on("add-task",async (data, callback) => {
            try{
                const {taskTitle,taskDes,value,employeeId} = data;
                let employee = await Employee.findById(employeeId);
                let manager = await Employee.findById(socket.employee.id);

                if(employee.position !== manager.position){
                      return callback({ error: 'you can\'t access this employee' });
                }
                
           employee.task.push(
                   { 
                    employeeId: employee._id,
                    ManagerId: manager._id,
                    taskTitle:taskTitle,
                    taskDes:taskDes,
                    value:value  
                }
                );
                await employee.save();

                    const savedTask = employee.task[employee.task.length - 1];
                 io.of("/employee").to(employeeId.toString()).emit("newTask", savedTask);
            callback({ success: true});
            }
            catch(err){
            console.error(err);
            callback({ error: 'An error occurred while adding new requset.' });
            }
        });
   
        socket.on("task-status", async (data, callback) => {
  try {
    const { status, statusDes, taskId } = data;

    // First, find the employee who owns the task
    const employee = await Employee.findOne({ "task._id": taskId });

    if (!employee) {
      return callback({ error: "Task not found" });
    }

    // Find the task in the embedded array
    const task = employee.task.id(taskId);

    if (!task) {
      return callback({ error: "Task not found in employee" });
    }

    // Update the task fields
    task.status = status;
    task.statusDes = statusDes;

    await employee.save();

    // Emit the updated task to the employee
    io.of("/employee").to(task.employeeId.toString()).emit("taskStatusUpdate", task);
    callback({ success: true });
  } catch (err) {
    console.error(err);
    callback({ error: "An error occurred while updating task status." });
  }
});

    });
};

module.exports = employeeSocket;