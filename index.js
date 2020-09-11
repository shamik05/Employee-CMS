const orm = require("./config/orm.js");
const inquirer = require("inquirer");
const cTable = require("console.table");

// View employees with view (ALL, BY DEPARTMENT, BY MANAGER) passed in as argument
const viewEmp = type => {
  orm.selectOrder(type, function(err, result) {
  if (err) throw err;
  console.log("\n\n");
  console.table(result);
  });
  menu();
};

// Adds employee
const addEmp = async () => {
  inquirer.prompt([
    {
      name: "first_name",
      message: "What is the employee's first name?",
      validate: input=>{
        return input !== '' || "Name cannot be empty.";
      }
    },
    {
      name: "last_name",
      message: "What is the employee's last name?",
      validate: input=>{
        return input !== '' || "Name cannot be empty.";
      }
    },
    {
      type: "list",
      name: "role_id",
      message: "What is the employee's role?",
      choices: await orm.findRoles()
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: await orm.findEmployees().then(result => {
          result.unshift({value: null, name: "None"});
          return result;
          })
    }
  ]).then(answers => {
   orm.insertEmployee(answers);
   viewEmp("All");
  });
};

// Delete employee
const removeEmp = async () => {
  inquirer.prompt({
    type: "list",
    name: "employee",
    message: "Which employee do you want to terminate?",
    choices: await orm.findEmployees().then(result => {
        result.unshift({value: null, name: "None"});
        console.log(result);
        return result;
        })
  }).then(answers => {
    orm.deleteEmployee(answers.employee);
    viewEmp("All");
  });
};

// Update employee's role
const updateEmpRole = async () => {
  inquirer.prompt({
    type: "list",
    name: "manager_id",
    message: "Who is the employee's manager?",
    choices: await orm.findEmployees().then(result => {
        result.unshift({value: null, name: "None"});
        return result;
        })
  }).then(answers => {
    orm.deleteEmployee(answers.manager_id);
    viewEmp("All");
  });
};

// Main menu 
const menu = () => {
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "View All Employees",
      "View All Employees by Department",
      "View All Employees by Manager",
      "Add Employee",
      "Remove Employee",
      "Update Employee Role",
      "Update Employee Manager",
      "View All Roles",
      "Add Role",
      "Remove Role",
      "Exit",
    ],
  }).then(answer => {
    switch (answer.menu) {
      case "View All Employees":
        viewEmp("All");
        break;
      case "View All Employees by Department":
        viewEmp("Department");
        break;
      case "View All Employees by Manager":
        viewEmp("Manager");
        break;
      case "Add Employee":
        addEmp();
        break;
      case "Remove Employee":
        removeEmp();
        break;
      case "Exit":
        console.log("Exiting");
        break;
      default:
        connection.end();
        break;
    }
  });
};

menu();