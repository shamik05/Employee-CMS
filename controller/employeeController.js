// Import dependencies
const inquirer = require("inquirer");
const index = require("../index");
const {
  employeeView, employeeAdd, employeeFind, rolesFind, rowUpdate, rowDelete,
} = require("../config/orm");

// All functions related to employee submenu
const employee = {
// Employee Management Menu
  menu: async () => {
    inquirer.prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      pageSize: 10,
      choices: [
        "View All Employees",
        "View All Employees by Department",
        "View All Employees by Manager",
        "Add Employee",
        "Remove Employee",
        "Update Employee Role",
        "Update Employee Manager",
        "Go Back",
      ],
    }).then((answers) => {
      // Depending on answer, invoke appropriate function
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
        employee.add();
        break;
      case "Remove Employee":
        employee.delete();
        break;
      case "Update Employee Role":
        employee.updateRole();
        break;
      case "Update Employee Manager":
        employee.updateManager();
        break;
      default:
        // Returns to main menu
        index.menu();
        break;
      }
    });
  },

  // View employees with view (ALL, BY DEPARTMENT, BY MANAGER) passed in as argument
  view: async (type) => {
    employeeView(type).then((result) => {
      console.log("\n");
      // Displays results as columns
      console.table(result);
    });
    // Displays employee management menu
    employee.menu();
  },

  // Adds employee
  add: async () => {
    inquirer.prompt([
      // Ask employee's first name
      {
        name: "first_name",
        message: "What is the employee's first name?",
        // Name cannot be empty
        validate: (input) => input !== "" || "Name cannot be empty.",
      },
      // Asks employee's last name
      {
        name: "last_name",
        message: "What is the employee's last name?",
        // Name cannot be empty
        validate: (input) => input !== "" || "Name cannot be empty.",
      },
      // Ask employee's role
      {
        type: "list",
        name: "role_id",
        pageSize: 15,
        message: "What is the employee's role?",
        // Lists all roles to choose from
        choices: await rolesFind(),
      },
      // Ask if the employee has a manager
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        pageSize: 15,
        // Lists all employees to choose from
        choices: await employeeFind().then((result) => {
          // Inserts a return option to employee menu at index 0
          result.unshift({ value: null, name: "None" });
          return result;
        }),
      },
    ]).then((answers) => {
      // Add row to employee table
      employeeAdd(answers);
      employee.view("All");
    });
  },

  // Delete employee
  delete: async () => {
    // Asks which employee to delete
    await inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 15,
      message: "Which employee do you want to terminate?",
      // Lists all employee to choose from
      choices: await employeeFind().then((result) => {
        // Inserts a return option to employee menu at index 0
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      // A employee wasn't chosen so return to employee management menu
      if (answers.employee === null) {
        employee.menu();
      } else {
        // Call orm function to delete the employee row using their id
        rowDelete(["employee", "id", answers.id]);
        // Shows the updated employees
        employee.view("All");
      }
    });
  },

  // Update employee's role
  updateRole: async () => {
    // Asks which employee to update
    inquirer.prompt([
      {
        type: "list",
        name: "id",
        pageSize: 15,
        message: "Who is the employee?",
        // Lists all employees to choose from
        choices: await employeeFind().then((result) => {
          // Inserts a return option to employee menu at index 0
          result.unshift({ value: null, name: "Go Back" });
          return result;
        }),
      },
      // Ask for their new role
      {
        type: "list",
        name: "role_id",
        pageSize: 15,
        message: "What is the employee's new role?",
        // Lists all roles to choose from
        choices: await rolesFind(),
        when: (answers) => answers.id != null,
      },
    ]).then((answers) => {
      // If an employee wasn't chosen then return to employee management menu
      if (answers.id === null) {
        employee.menu();
      } else {
        // Update the employee's role with their new role
        rowUpdate(["employee", "role_id", answers.role_id, "id", answers.id]);
        // Shows the updated employees
        employee.view("All");
      }
    });
  },

  // Update employee's manager
  updateManager: async () => {
    // Asks which employee to update
    inquirer.prompt([
      {
        type: "list",
        name: "id",
        pageSize: 15,
        message: "Who is the employee?",
        // Lists all employees to choose from
        choices: await employeeFind().then((result) => {
          // Inserts a return option to employee menu at index 0
          result.unshift({ value: null, name: "Go Back" });
          return result;
        }),
      },
      // Ask for their new manager
      {
        type: "list",
        name: "manager_id",
        pageSize: 15,
        message: "Who is the employee's manager?",
        // Lists all employees to choose from
        choices: await employeeFind().then((result) => {
          // Inserts a none option to employee menu at index 0
          result.unshift({ value: null, name: "None" });
          return result;
        }),
        when: (answers) => answers.id != null,
      },
    ]).then((answers) => {
      // A employee wasn't chosen so return to employee management menu
      if (answers.id === null) {
        employee.menu();
      // If the same employee was chosen as their manager, return to management menu
      } else if (answers.id === answers.manager_id) {
        console.log("Employee cannot be its own manager");
        employee.menu();
      } else {
        // Call orm function to update the employee's manager
        rowUpdate(["employee", "manager_id", answers.manager_id, "id", answers.id]);
        // Shows the updated employees
        employee.view("All");
      }
    });
  },
};

// Exports all employee functions
module.exports = employee;
