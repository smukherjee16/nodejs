//required npm imports for this projects
const debugLog = require('debug')('app:debug');//set DEBUG=app:*
const errorLog = require('debug')('app:error');
const express = require('express');
const app = express();
const _ = require('underscore');
const Joi = require('joi');
const Request = require("request");
const logger = require('./middleware/logger');
const morgan = require('morgan');
const auth = require('./middleware/auth');
const helmet = require('helmet');
const home = require('./routes/home');
//const emp = require('./routes/emp');
const moment = require('moment');
moment().format();
const validations = require('./validations/validations');
const employeesmodel = require('./model/employeemodel');
const employees = employeesmodel.employees;

//middleware - in-request processing pipeline
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(express.static('Public'));//http://localhost:3000/readme.pdf

//middleware - Logging every incoming request
app.use(logger);
//set NODE_ENV=production if you want to set it for production.
if(app.get('env') === 'development'){
    app.use(morgan('tiny'));
    debugLog('Morgan enabled for cross cutting logging in dev environment...');
}

//middleware - req headers
app.use(helmet());

//middleware - Authoentication and Authorizing incming request
app.use(auth);

app.use('/', home);
//app.use('/api/employees', emp);

//read from environment variable. 
//to set a port as an env variable, run the following command in cmd
//set PORT=XXXX
const port = process.env.PORT || 3000;
app.listen(port, () => {
    debugLog(`Listening on port ${port}...`);
});

//validate schema
const schema = {
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    role: Joi.string().min(1).required(),
    hireDate: Joi.date().required()
}

//valid roles
const avaiableRoles = ["LACKEY", "MANAGER", "VP", "CEO"];


//endpoint http://localhost:3000
//HTTP Method: GET
app.get('/', (req, res) => {
    res.send('Hello World!!!');
});

/*
Task: Get all employee
Endpoint: http://localhost:3000/api/employees
Http Method: GET
Responses:
Success: 200
*/
app.get('/api/employees', (req, res) => {
    res.send(employees);
});


/*
Task: Get employee by id
Endpoint: http://localhost:3000/api/employees/:id
Http Method: GET
Responses:
Id not found: 404
Success: 200
*/
app.get('/api/employees/:id', (req, res) => {
    const employee = findEmployeeById(employees, req.params.id);
    if(!employee){
        errorLog(`Employee by id: ${req.params.id} note found!`);
        return res.status(404).send(`Employee by id ${req.params.id} not found!`);
    }else{
        res.send(employee);
    }
});



/*
Task: Add new employee
Endpoint: http://localhost:3000/api/employees
Http Method: POST
Responses:
Validation failure: 400
Success: 201
*/

app.post('/api/employees', (req, res) => {
    //validation checks

   //firstName, lastName, role, hireDate can't be empty
    
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const role = req.body.role.toString().toUpperCase();
    const hireDate = req.body.hireDate;

    const {error} = Joi.validate(req.body, schema);
    if(error){
        errorLog(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    //role must be lackey, manager, vp, ceo case insensitive. 
    
    if(!validations.testValidRole(avaiableRoles, role)){
        errorLog(`Role is invalid`);
        return res.status(400).send("BAD REQUEST: Invalid role");
    }
    
    //only one CEO
    if(!validations.testCanAddRole(employees, role)){       
        errorLog(`Can't have more than one employee as the CEO`);
        return res.status(400).send("BAD REQUEST: Can't have more than one employee as the CEO");            
    }

    //hire date must be in format YYYY-MM-DD
    if(!validations.testHireDateFormat(hireDate)){        
        errorLog(`Date format is incorrect. Expected format is YYYY-MM-DD`);
        return res.status(400).send("BAD REQUEST: Date format is incorrect. Expected format is YYYY-MM-DD");        
    }

    
    //hireDate always in past
    if(!validations.testHireDateInPast(hireDate)){
        errorLog(`Hire Date must be in past`);
        return res.status(400).send("BAD REQUEST: Hire Date must be in past");
    }

    var m1="";
    var m2 = "";
    const newId = new Date().getTime();//employees.length + 1;
    const employee = {
        id: newId,
        firstName: firstName,
        lastName: lastName,
        role: role,
        hireDate: hireDate,
        //These two should be derieved from external endpoints
        favoriteMessage1: m1,
        favoriteMessage2: m2

    }

    //TODO get messages from function
    
    getM1("https://ron-swanson-quotes.herokuapp.com/v2/quotes", employee)    
    .then(result => {employee.favoriteMessage1 = result; getM2("https://quotes.rest/qod", employee)})
    .then(result => {employee.favoriteMessage2 = result; addEmployee(employee)})
    .catch(err => errorLog(err));

   //callbacks printing in console
    /*getM1("https://ron-swanson-quotes.herokuapp.com/v2/quotes", (message1) => {
        console.log("Message: " + message1); 
        m1 = message1;
    });
    console.log("M1: "  + m1);
    getM2("https://quotes.rest/qod", (message2) => {
        console.log("Message: " + message2);
        m2 = message2;
    });
    console.log("M2: "  + m2);
    */

    /*const p3 = addEmployee(employee);
    console.log("Adding Employee");
    employees.push(employee);*/

    
    res.status(201).send(employee);
});

function addEmployee(employee){
    return new Promise((resolve, reject) => {
        console.log("before: " + employees.length);
        employees.push(employee);
        console.log("after: " + employees.length);
        resolve;
    })
}

    

/*
Task: Update employee by Path Param: id
Endpoint: http://localhost:3000/api/employees/:id
Http Method: PUT
Responses:
Id not found: 404
Validation failure: 400
Success: 200
*/
app.put('/api/employees/:id', (req, res) => {
    //find emplpyee by id. if not found return 404
    const employee = findEmployeeById(employees, req.params.id);
    if(!employee){
        errorLog(`Employee by id: ${req.params.id} note found!`);
        return res.status(404).send(`Employee by id ${req.params.id} not found!`);
    }

    //validate input
    const firstName = req.body.firstName;
    const lastName = req.body.lastName;
    const role = req.body.role.toString().toUpperCase();
    const hireDate = req.body.hireDate;

    const {error} = Joi.validate(req.body, schema);
    if(error){
        errorLog(error.details[0].message);
        return res.status(400).send(error.details[0].message);
    }

    //role must be lackey, manager, vp, ceo case insensitive. 
    if(!validations.testValidRole(avaiableRoles, role)){
        errorLog(`Role is invalid`);
        return res.status(400).send("BAD REQUEST: Invalid role");        
    }

    //only one CEO
    if(!validations.testCanAddRole(employees, role)){   
        errorLog(`Can't have more than one employee as the CEO`);
        return res.status(400).send("BAD REQUEST: Can't have more than one employee as the CEO");
    }       

    //hire date must be in format YYYY-MM-DD
    if(!validations.testHireDateFormat(hireDate)){              
        errorLog(`Date format is incorrect. Expected format is YYYY-MM-DD`);
        return res.status(400).send("BAD REQUEST: Date format is incorrect. Expected format is YYYY-MM-DD");        
    }

    //hireDate always in past
    if(!validations.testHireDateInPast(hireDate)){
        errorLog(`Hire Date must be in past`);
        return res.status(400).send("BAD REQUEST: Hire Date must be in past");
    }

    //update employee
    employee.firstName = firstName;
    employee.lastName = lastName;
    employee.role = role;
    employee.hireDate = hireDate;

    //send the reponse
    res.send(employee);
});


/*
Task: Delete employee by Path Param: id
Endpoint: http://localhost:3000/api/employees/:id
Http Method: DELETE
Responses:
Id not found: 404
Success: 204
*/
app.delete('/api/employees/:id', (req, res) => {
    const employee = findEmployeeById(employees, req.params.id);
    if(!employee){
        errorLog(`Employee by id: ${req.params.id} note found!`);
        return res.status(404).send(`Employee by id ${req.params.id} not found!`);
    }else{
        const index = employees.indexOf(employee);
        employees.splice(index, 1);
        res.status(204).send(employee);
    }
});

//private methods

function findEmployeeById(employees, id){
    return employees.find(e => e.id === parseInt(id) );
}

function getM1(url, employee){
    return new Promise((resolve, reject) =>{
    Request.get(url, (error, response, body) => {
        var m1 = "";
        if(error) {
            reject(error);
        }
        debugLog("SEE BELOW");
        debugLog(JSON.parse(body));
        m1 = body;
        console.log("test m1:  " + m1);
        resolve( employee.favoriteMessage1 = m1);
        });
        });
    }


function getM2(url, employee){
    return new Promise((resolve, reject) =>{
    Request.get(url, (error, response, body) => {
        if(error) {
            reject(error);
        }
        debugLog("SEE BELOW");
        debugLog(JSON.parse(body));
        var jsonParsed = JSON.parse(body);
        var message = jsonParsed.contents.quotes[0].quote;
        debugLog(jsonParsed);
        debugLog(message);
        console.log("test m2: " + message);
        resolve( employee.favoriteMessage2 = message);
    });
    });
}

module.exports.findEmployeeById = findEmployeeById;




