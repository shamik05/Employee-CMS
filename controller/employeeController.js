const inquirer = require("inquirer");
const index = require("../index");
const {employeeView} = require("../config/orm");

const employee = {
// Employee Management Menu
menu: async () => {
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
      "Go Back"
    ]
  })
  .then(answers => {
  switch (answers.menu) {
    case "View All Employees":
      employee.view("All");
      break;
    case "View All Employees by Department":
      employee.view("Department");
      break;
    case "View All Employees by Manager":
      employee.view("Manager");
      break;
    case "Add Employee":
      // employeeAdd();
      break;
    case "Remove Employee":
      // employeeDelete();
      break;
    case "Update Employee Role":
      // employeeUpdateRole();
      break;
    case "Update Employee Manager":
      // employeeUpdateManager();
      break;
    default:
      index.menu();
      break;          
    };
  });
},

// View employees with view (ALL, BY DEPARTMENT, BY MANAGER) passed in as argument
view: type => {
  employeeView(type, function(err, result) {
  if (err) throw err;
  console.log("\n\n");
  console.table(result);
  });
  employee.menu();
},

// Adds employee
add: async () => {
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
    choices: await rolesFind()
  },
  {
    type: "list",
    name: "manager_id",
    message: "Who is the employee's manager?",
    choices: await employeeFind().then(result => {
        result.unshift({value: null, name: "None"});
        return result;
        })
  }
  ]).then(answers => {
   employeeAdd(answers);
   employee.view("All");
  });
}
}

module.exports = employee;