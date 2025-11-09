const Employee = require("../model/employee");
const {leaveRequest} = require('../model/leaveRequest');
const isHr = require('../socket-middleware/is-hr-manager');

const HrSocket = (io) => {
    io.of("/hr-manager").use(isHr).on("connection",(socket)=>{
        console.log('Admin connected:', socket.employee.id);

        socket.join("hr manager");
        socket.on('modifyReq', async (data, callback) => {

   try{    
       const {status,id}= data;
     
            let employeeReq = await leaveRequest.findById(id);

            employeeReq.status = status;
            employeeReq.endDate = Date.now;
            await employeeReq.save();

            io.of("/empolyee").to("hr manager").emit("employeeReq", employeeReq);
            callback({ success: true});

        }

catch(err){
    console.error(err);
    callback({ error: 'An error occurred while modify the requset.' });
}

        });

    });
};

module.exports = HrSocket;