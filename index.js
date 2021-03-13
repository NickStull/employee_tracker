const inquirer = require("inquirer")
const connection = require("./employeeTrackerDB")

function init() {
  console.log(
  `
  ███████╗███╗   ███╗██████╗ ██╗      ██████╗ ██╗   ██╗███████╗███████╗
  ██╔════╝████╗ ████║██╔══██╗██║     ██╔═══██╗╚██╗ ██╔╝██╔════╝██╔════╝
  █████╗  ██╔████╔██║██████╔╝██║     ██║   ██║ ╚████╔╝ █████╗  █████╗  
  ██╔══╝  ██║╚██╔╝██║██╔═══╝ ██║     ██║   ██║  ╚██╔╝  ██╔══╝  ██╔══╝  
  ███████╗██║ ╚═╝ ██║██║     ███████╗╚██████╔╝   ██║   ███████╗███████╗
  ╚══════╝╚═╝     ╚═╝╚═╝     ╚══════╝ ╚═════╝    ╚═╝   ╚══════╝╚══════╝
                                                                        
  ███╗   ███╗ █████╗ ███╗   ██╗ █████╗  ██████╗ ███████╗██████╗        
  ████╗ ████║██╔══██╗████╗  ██║██╔══██╗██╔════╝ ██╔════╝██╔══██╗       
  ██╔████╔██║███████║██╔██╗ ██║███████║██║  ███╗█████╗  ██████╔╝       
  ██║╚██╔╝██║██╔══██║██║╚██╗██║██╔══██║██║   ██║██╔══╝  ██╔══██╗       
  ██║ ╚═╝ ██║██║  ██║██║ ╚████║██║  ██║╚██████╔╝███████╗██║  ██║       
  ╚═╝     ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝╚═╝  ╚═╝ ╚═════╝ ╚══════╝╚═╝  ╚═╝       
                                                                        
  `
  );

  inquirer
    .prompt({
        type: 'list',
        message: 'Hit enter to begin?',
        choices: ['Start'],
        name: 'start'
    })
    .then(function() {
    start();
  })
}

function start() {
  inquirer
      .prompt({
          type: 'list',
          message: 'What would you like to do?',
          choices: ['View Employees', 'View Departments',  'View Roles', 'Add Employee', 'Add Role', 'Add Department', 'Exit'],
          name: 'start'
      })
      .then(function(response) {
          switch (response.start) {
              case 'View Employees':
                  viewAllEmployees();
                  break;
              case 'View Departments':
                  viewDepartments();
                  break;
              case 'View Roles':
                  viewRoles();
                  break;
              case 'Add Employee':
                  addEmployee();
                  break;
              case 'Add Department':
                  addDepartment();
                  break;
              case 'Add Role':
                  addRole();
                  break;
              case 'Exit':
                  exitProgram();
                  break;
          }
      })
}

function viewAllEmployees() {
  connection.query(`SELECT employee.first_name, employee.last_name, employee.id, employee.role_id, role.id, role.title, role.salary, department.name FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id`, function(err, res) {
      if (err) throw err
      console.table(res);
      console.log(`\n___________________________________\n`);
      start();
  })
}

function viewRoles() {
  connection.query(`SELECT title, salary, department_id FROM role`, function(err, res) {
      if (err) throw err;console.table(res);
      console.log(`\n___________________________________\n`)
      start();
  })
}

function viewDepartments() {
  connection.query("SELECT name FROM department", function(err, res) {
      if (err) throw err;
      console.table(res);
      console.log(`\n___________________________________\n`)
      start();
  })
}

function addEmployee() {
  connection.query(`SELECT title, id FROM role`, function(err, res) {
      if (err) throw err;

      let roles = [];
      for (let i = 0; i < res.length; i++) {
          let role = {
              name: res[i].title,
              value: res[i].id
          }
          roles.push(role);
      }
      inquirer
          .prompt([{
                  type: "input",
                  message: "First name?",
                  name: "firstName"
              },
              {
                  type: "input",
                  message: "Last name?",
                  name: "lastName"
              },
              {
                  type: "list",
                  message: "Role?",
                  choices: roles,
                  name: "role"
              },
          ])
          .then(function(response) {
              connection.query(`INSERT INTO employee SET ?`, {
                      first_name: response.firstName,
                      last_name: response.lastName,
                      role_id: response.role,
                  },
                  function(err, res) {
                      if (err) throw err;
                      console.log(`\nAdded.`)
                      console.log(`\n___________________________________\n`);
                      start();
                  })
          })
  })
}

function addRole() {
  connection.query("SELECT * FROM department", function(err, res) {
      if (err) throw err;

      let depts = [];
      for (let i = 0; i < res.length; i++) {
          let dept = {
              name: res[i].name,
              value: res[i].id
          }
          depts.push(dept);
      }
      inquirer
          .prompt([{
              type: 'input',
              message: "Role name?",
              name: "role"
          }, {
              type: 'list',
              message: "Department?",
              choices: depts,
              name: "department"
          }, {
              type: 'input',
              message: 'Salary?',
              name: "salary"
          }])
          .then(function(response) {
              connection.query(`INSERT INTO role (title, salary, department_id) VALUES ("${response.role}", "${parseInt(response.salary).toFixed(2)}", "${response.department}")`, function(err2, res2) {
                  if (err2) throw err2;
                  console.log(`\nAdded. \n`)
                  console.log(`\n___________________________________\n`);
                  start();
              })
          })
  })
}

function addDepartment() {
  inquirer
      .prompt({
          type: 'input',
          message: 'Department name?',
          name: 'department'
      })
      .then(function(response) {
          connection.query(`INSERT INTO department (name) VALUES ("${response.department}")`, function(err, res) {
              if (err) throw err;
              console.log(`Added.\n`);
              console.log(`\n___________________________________\n`);
              start();
          })
      })
}

function exitProgram() {
  console.log("End")
  connection.end();
}

init();