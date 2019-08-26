const indexjs = require('../index');
const avaiableRoles = ["LACKEY", "MANAGER", "VP", "CEO"];
const employees = [
    {id: 1, firstName: 'Mark', lastName: 'Anthony', role: 'MANAGER', hireDate: '2017-12-10', 
        favoriteMessage1: 'messaege1', favoriteMessage2: 'message2'},
    {id: 2, firstName: 'Dave', lastName: 'Barton', role: 'CEO', hireDate: '2017-10-10', 
        favoriteMessage1: 'messaege11', favoriteMessage2: 'message22'}
]


test('Valid roles test: CEO TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "CEO");
    expect(result).toBe(true);
});

test('Valid roles test: ceo TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "ceo");
    expect(result).toBe(true);
});

test('Valid roles test: VP TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "VP");
    expect(result).toBe(true);
});

test('Valid roles test: vp TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "vp");
    expect(result).toBe(true);
});

test('Valid roles test: MANAGER TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "MANAGER");
    expect(result).toBe(true);
});

test('Valid roles test: manager TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "manager");
    expect(result).toBe(true);
});

test('Valid roles test: LACKEY TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "LACKEY");
    expect(result).toBe(true);
});

test('Valid roles test: lackey TRUE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "lackey");
    expect(result).toBe(true);
});

test('Invalid role test: INVALID FALSE', () => {
    const result = indexjs.testValidRole(avaiableRoles, "INVALID");
    expect(result).toBe(false);
});

test('Only one ceo test: Add CEO: FALSE', () => {
    const result = indexjs.testCanAddRole(employees, 'CEO');
    expect(result).toBe(false);
});

test('Only one ceo test: Add MANAGER: TRUE', () => {
    const result = indexjs.testCanAddRole(employees, 'MANAGER');
    expect(result).toBe(true);
});

test('Valid Hire Date format: YYYY-MM-DD: TRUE', () => {
    const result = indexjs.testHireDateFormat('2016-05-20');
    expect(result).toBe(true);
});

test('Invalid Hire Date format: YYYY-Mon-DD: FALSE', () => {
    const result = indexjs.testHireDateFormat('2016-MAY-20');
    expect(result).toBe(false);
});

test('Valid Hire Date in past: 2016-03-20: TRUE', () => {
    const result = indexjs.testHireDateInPast('2016-03-20');
    expect(result).toBe(true);
});

test('Invalid Hire Date in pfutureast: 2026-03-20: FALSE', () => {
    const result = indexjs.testHireDateInPast('2026-03-20');
    expect(result).toBe(false);
});

test('absolute', () => {
    const result = indexjs.absolute(1);
    expect(result).toBe(1);
})