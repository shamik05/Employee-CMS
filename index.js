const orm = require("./config/orm.js");
const inquirer = require("inquirer");
const cTable = require("console.table");

// View employees with view (ALL, BY DEPARTMENT, BY MANAGER) passed in as argument
const employeeView = type => {
  orm.employeeView(type, function(err, result) {
  if (err) throw err;
  console.log("\n\n");
  console.table(result);
  });
  menu();
};

// Adds employee
const employeeAdd = async () => {
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
      choices: await orm.rolesFind()
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: await orm.employeeFind().then(result => {
          result.unshift({value: null, name: "None"});
          return result;
          })
    }
  ]).then(answers => {
   orm.employeeAdd(answers);
   viewEmp("All");
  });
};

// Delete employee
const employeeDelete = async () => {
  inquirer.prompt({
    type: "list",
    name: "employee",
    message: "Which employee do you want to terminate?",
    choices: await orm.employeeFind().then(result => {
        result.unshift({value: null, name: "Go Back"});
        return result;
        })
  }).then(answers => {
    if(answers.employee === null) {
      menu();
    } else {
      orm.employeeDelete(answers.employee);
      viewEmp("All");
    };
  });
};

// Update employee's role
const employeeUpdateRole = async () => {
  inquirer.prompt([
  {
    type: "list",
    name: "id",
    message: "Who is the employee?",
    choices: await orm.employeeFind().then(result => {
        result.unshift({value: null, name: "Go Back"});
        return result;
        })
  },
  {
    type: "list",
    name: "role_id",
    message: "What is the employee's new role?",
    choices: await orm.rolesFind(), 
    when: answers => answers.id != null
  }
  ]).then(answers => {
    console.log(answers);
    if(answers.id === null) {
      menu();
    } else {
      orm.employeeUpdate(["employee", "role_id",answers.role_id, "id", answers.id]);
      viewEmp("All");
    };
  });
};

// Update employee's manager
const employeeUpdateManager = async () => {
  inquirer.prompt([
    {
      type: "list",
      name: "id",
      message: "Who is the employee?",
      choices: await orm.employeeFind().then(result => {
          result.unshift({value: null, name: "Go Back"});
          return result;
          })
    },
    {
      type: "list",
      name: "manager_id",
      message: "Who is the employee's manager?",
      choices: await orm.employeeFind().then(result => {
        result.unshift({value: null, name: "None"});
        return result;
        }), 
      when: answers => answers.id != null
    }
    ]).then(answers => {
      if(answers.id === null) {
        menu();
      } else if (answers.id === answers.manager_id) {
        console.log("Employee cannot be its own manager");
        menu();
      } else {
        orm.updateEmployee(["employee", "manager_id",answers.manager_id, "id", answers.id]);
        viewEmp("All");
      };
    });
};

// View all roles
const rolesView = async () => {
  orm.rolesView(function(err, result) {
    if (err) throw err;
    console.log("\n\n");
    console.table(result);
    });
    menu();
};

const rolesAdd = async () => {
  inquirer.prompt([
    {
      name: "title",
      message: "What is the role title?",
      validate: input=>{
        return input !== '' || "Title cannot be empty.";
      }
    },
    {
      name: "salary",
      message: "What is the role salary?",
      validate: input=>{
       if(isNaN(input)){
            return "Id has to be a number."
        } else if(input<0){
          return "Id has to be a positive number."
        } else if(input === ""){
            return "Id cannot be empty."
        }else{
            return true;
        };
      }
    },
    {
      type: "list",
      name: "department_id",
      message: "What is the employee's role?",
      choices: await orm.departmentFind()
    }
  ]).then(answers => {
    console.log(answers);
   orm.rolesAdd(answers);
   rolesView();
  });
};

// Main menu 
const menu = () => {
  console.log("\n\n");
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
        employeeView("All");
        break;
      case "View All Employees by Department":
        employeeView("Department");
        break;
      case "View All Employees by Manager":
        employeeView("Manager");
        break;
      case "Add Employee":
        employeeAdd();
        break;
      case "Remove Employee":
        employeeDelete();
        break;
      case "Update Employee Role":
        employeeUpdateRole();
        break;
      case "Update Employee Manager":
        employeeUpdateManager();
        break;
      case "View All Roles":
        rolesView();
        break;
      case "Add Role":
        rolesAdd();
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