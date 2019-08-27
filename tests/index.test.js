const indexjs = require('../index');
const validations = require('../validations/validations');
const avaiableRoles = ["LACKEY", "MANAGER", "VP", "CEO"];
const employees = [
    {id: 1, firstName: 'Mark', lastName: 'Anthony', role: 'MANAGER', hireDate: '2017-12-10', 
        favoriteMessage1: 'messaege1', favoriteMessage2: 'message2'},
    {id: 2, firstName: 'Dave', lastName: 'Barton', role: 'CEO', hireDate: '2017-10-10', 
        favoriteMessage1: 'messaege11', favoriteMessage2: 'message22'}
]

describe('testValidRole', () => {
    it('Valid roles test: TRUE', () => {
        const validInputRoles = ['CEO', 'ceo', 'MANAGER', 'manager', 'VP', 'vp', 'LACKEY', 'lackey'];
        validInputRoles.forEach(r => {
            const result = validations.testValidRole(avaiableRoles, r);
            expect(result).toBe(true);
        })
    });   
    
    it('Invalid role test: INVALID FALSE', () => {
        const result = validations.testValidRole(avaiableRoles, "INVALID");
        expect(result).toBe(false);
    });
});

describe('testCanAddRole', () => {
    it('Only one ceo test: Add CEO: FALSE', () => {
        const result = validations.testCanAddRole(employees, 'CEO');
        expect(result).toBe(false);
    });
    
    it('Only one ceo test: Add MANAGER: TRUE', () => {
        const result = validations.testCanAddRole(employees, 'MANAGER');
        expect(result).toBe(true);
    });
    
});

describe('testHireDateFormat', () => {
    it('Valid Hire Date format: YYYY-MM-DD: TRUE', () => {
        const result = validations.testHireDateFormat('2016-05-20');
        expect(result).toBe(true);
    });
    
    it('Invalid Hire Date format: YYYY-Mon-DD: FALSE', () => {
        const result = validations.testHireDateFormat('2016-MAY-20');
        expect(result).toBe(false);
    });
    
})

describe('testHireDateInPast', () => {
    it('Valid Hire Date in past: 2016-03-20: TRUE', () => {
        const result = validations.testHireDateInPast('2016-03-20');
        expect(result).toBe(true);
    });
    
    it('Invalid Hire Date in pfutureast: 2026-03-20: FALSE', () => {
        const result = validations.testHireDateInPast('2026-03-20');
        expect(result).toBe(false);
    });
})

describe('findEmployeeById', () => {
    it('Valid id: TRUE' , () => {
        const e1 = indexjs.findEmployeeById(employees, "1");
        expect(e1).toEqual({'id': 1, 'firstName': 'Mark', 'lastName': 'Anthony', 'role': 'MANAGER', 'hireDate': '2017-12-10', 
        'favoriteMessage1': 'messaege1', 'favoriteMessage2': 'message2'});
    });

    it('Valid id: TRUE' , () => {
        const e1 = indexjs.findEmployeeById(employees, "100");
        expect(e1).toBe(undefined);
    });
  })


test('absolute', () => {
    const result = validations.absolute(1);
    expect(result).toBe(1);
})