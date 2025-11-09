const jwt = require('jsonwebtoken');
const bcrypt  = require('bcryptjs');


const Employee = require('../model/employee');
require('dotenv').config();



exports.login = async (req, res, next) => {
    try {
      const email = req.body.email?.trim();
      const password = req.body.password?.trim();

      const employee = await Employee.findOne({ email: email });
      if (!employee) {
        const error = new Error('The email or password is incorrect');
        error.statusCode = 401;
        throw error;
      }
  
      const isMatch = await bcrypt.compare(password, employee.password);
      if (!isMatch) {
        const error = new Error('The email or password is incorrect');
        error.statusCode = 401;
        throw error;
      }
  
      const token = jwt.sign(
        { id: employee._id },
        process.env.JWT_SECRET,
        { expiresIn: '9h' } // Token expires after 9 hours
      );
  
      console.log(" your token "+ token + " your employee "+ employee );
  
      return res.json({ token, ...employee._doc });
    } catch (err) {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    }
  };
  


  exports.createHrAccount = async (req, res, next) => {
    const email = req.body.email?.trim();
    const password = req.body.password?.trim();
    const existEmployee = await Employee.findOne({ email: email });
      if (existEmployee) {
        const error = new Error('The email or password is incorrect');
        error.statusCode = 401;
        throw error;
      }
  
      const {name,department,position,gender , salary , phoneNumber} = req.body;

    const hashPass =await bcrbt.hash(password , 12);
    

      let employee = new Employee({
        phoneNumber:phoneNumber,
        salary:salary,
          email:email,
          password: hashPass,
          department:department,
          gender:gender,
          position:position,
         name:name
      });
      employee.role = "hr manager";
      employee = await employee.save();

return  res.status(200).json(employee);

  };