const moment = require('moment');
moment().format();
const _ = require('underscore');
const employeesmodel = require('../model/employeemodel');
const employees = employeesmodel.employees;


//validation tests
//test valid roles
function testValidRole(avaiableRoles, role){
    role = role.toUpperCase();
    if(_.contains(avaiableRoles, role)){
        return true;
    }else{
        return false;
    }
}

//test only one CEO
function testCanAddRole(employees, role){
    var result = true;
    if(role === 'CEO'){
        employees.forEach (function (e){
            if(e.role === 'CEO'){
                result = false;
            }
        })
    }
    return result;
}

//test hireDate format YYYY-MM-YY
function testHireDateFormat(hireDate){
    if(moment(hireDate, "YYYY-MM-DD", true).isValid()){        
        return true;       
    }else{
        return false;
    }
}

//hireDate in past
function testHireDateInPast(hireDateStr){
    var today = new Date();
    var hireDate = new Date(hireDateStr);
    if(hireDate >= today){
        return false;
    }else{
        return true;
    }
}

module.exports.absolute = function(number){
    if(number > 0) return number;
    if(number < 0) return -number;
    return 0;
}

module.exports.testValidRole = testValidRole;
module.exports.testCanAddRole = testCanAddRole;
module.exports.testHireDateFormat = testHireDateFormat;
module.exports.testHireDateInPast = testHireDateInPast;

