const express = require('express');
const router = express.Router();
const Joi = require('joi');
const Request = require("request");

//load some default employees. Can set it to employee array also. 
const employees = [
    {id: 1, firstName: 'Mark', lastName: 'Anthony', role: 'MANAGER', hireDate: '2017-12-10', 
        favoriteMessage1: 'messaege1', favoriteMessage2: 'message2'},
    {id: 2, firstName: 'Dave', lastName: 'Barton', role: 'MANAGER', hireDate: '2017-10-10', 
        favoriteMessage1: 'messaege11', favoriteMessage2: 'message22'}
]

/*
TasK: Get all employee
Endpoint: http://localhost:3000/api/employees
Http Method: GET
Responses:
Success: 200
*/
router.get('/api/employees', (req, res) => {
    res.send(employees);
});


/*
TasK: Get employee by id
Endpoint: http://localhost:3000/api/employees/:id
Http Method: GET
Responses:
Id not found: 404
Success: 200
*/
router.get('/api/employees/:id', (req, res) => {
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if(!employee){
        errorLog(`Employee by id: ${req.params.id} note found!`);
        return res.status(404).send(`Employee by id ${req.params.id} not found!`);
    }else{
        res.send(employee);
    }
});

const schema = {
    firstName: Joi.string().min(1).required(),
    lastName: Joi.string().min(1).required(),
    role: Joi.string().min(1).required(),
    hireDate: Joi.date().required()
}

/*
TasK: Add new employee
Endpoint: http://localhost:3000/api/employees
Http Method: POST
Responses:
Validation failure: 400
Success: 201
*/
const avaiableRoles = ["LACKEY", "MANAGER", "VP", "CEO"];
router.post('/api/employees', (req, res) => {
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
    if(!_.contains(avaiableRoles, role)){
        errorLog(`Role is invalid`);
        return res.status(400).send("BAD REQUEST: Invalid role");
    }
    
    //only one CEO
    if(role === 'CEO'){
        employees.forEach (function (e){
            if(e.role === 'CEO'){
                errorLog(`Can't have more than one employee as the CEO`);
                return res.status(400).send("BAD REQUEST: Can't have more than one employee as the CEO");
            }
        })
    }

    
    //hireDate always in past
    var today = new Date();
    var hireDateForComp = new Date(hireDate);
    if(hireDateForComp >= today){
        errorLog(`Hire Date must be in past`);
        return res.status(400).send("BAD REQUEST: Hire Date must be in past");
    }

    //TODO not able to get messages from function
    var m1 = getM1();
    var m2 = getM2();
    
    const newId = employees.length + 1;
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
    employees.push(employee);
    res.status(201).send(employee);
});

function getM1(){
Request.get("https://ron-swanson-quotes.herokuapp.com/v2/quotes", (error, response, body) => {
    var m1 = "";
    if(error) {
        return errorLog(error);
    }
    debugLog("SEE BELOW");
    debugLog(JSON.parse(body));
    m1 = body;
    return m1;
    });
}

function getM2(){
    Request.get("https://quotes.rest/qod", (error, response, body) => {
        if(error) {
            return errorLog(error);
        }
        debugLog("SEE BELOW");
        debugLog(JSON.parse(body));
        var jsonParsed = JSON.parse(body);
        var message = jsonParsed.contents.quotes[0].quote;
        debugLog(jsonParsed);
        debugLog(message);
        return message;
    });
}

/*
TasK: Update employee by Path Param: id
Endpoint: http://localhost:3000/api/employees/:id
Http Method: PUT
Responses:
Id not found: 404
Validation failure: 400
Success: 200
*/
router.put('/api/employees/:id', (req, res) => {
    //find emplpyee by id. if not found return 404
    const employee = employees.find(e => e.id === parseInt(req.params.id));
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
    if(!_.contains(avaiableRoles, role)){
        errorLog(`Role is invalid`);
        return res.status(400).send("BAD REQUEST: Invalid role");        
    }

    //only one CEO
    if(role === 'CEO'){
        employees.forEach (function (e){
            if(e.role === 'CEO'){
                errorLog(`Can't have more than one employee as the CEO`);
                return res.status(400).send("BAD REQUEST: Can't have more than one employee as the CEO");
            }
        })
    }

    //hireDate always in past
    var today = new Date();
    var hireDateForComp = new Date(hireDate);
    if(hireDateForComp >= today){
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
TasK: Delete employee by Path Param: id
Endpoint: http://localhost:3000/api/employees/:id
Http Method: DELETE
Responses:
Id not found: 404
Success: 204
*/
router.delete('/api/employees/:id', (req, res) => {
    const employee = employees.find(e => e.id === parseInt(req.params.id));
    if(!employee){
        errorLog(`Employee by id: ${req.params.id} note found!`);
        return res.status(404).send(`Employee by id ${req.params.id} not found!`);
    }else{
        const index = employees.indexOf(employee);
        employees.splice(index, 1);
        res.status(204).send(employee);
    }
});

module.exports = router;