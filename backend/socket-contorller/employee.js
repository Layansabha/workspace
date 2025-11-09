const Employee = require("../model/employee");
const {leaveRequest} = require('../model/leaveRequest');
const isAuth = require('../socket-middleware/is-auth');
const employeeSocket = (io) => {
    io.of("/employee").use(isAuth).on("connection",(socket)=>{
        console.log('Admin connected:', socket.employee.id);

        socket.join(socket.employee.id);
        socket.on('leaveReq', async (data, callback) => {

   try{    
       const {reason,explainReason}= data;
            let employee = await Employee.findById(socket.employee.id);
            let leaveReq = new leaveRequest( {
                employeeId:employee._id,
                 employeeName: employee.name,
                 reason: reason,
                 explainReason:explainReason
               }
            );
            await leaveReq.save();

            let getReq = await leaveRequest.find({ status: null });

            io.of("/hr-manager").to("hr manager").emit("newReq", getReq);
            callback({ success: true});

        }

catch(err){
    console.error(err);
    callback({ error: 'An error occurred while adding new requset.' });
}

        });

    });
};

module.exports = employeeSocket;