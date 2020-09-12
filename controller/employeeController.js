const inquirer = require("inquirer");
const index = require("../index");
const {
  employeeView, employeeAdd, employeeFind, rolesFind, rowUpdate, rowDelete,
} = require("../config/orm");

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
    })
      .then((answers) => {
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
          index.menu();
          break;
        }
      });
  },

  // View employees with view (ALL, BY DEPARTMENT, BY MANAGER) passed in as argument
  view: (type) => {
    employeeView(type, (err, result) => {
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
        validate: (input) => input !== "" || "Name cannot be empty.",
      },
      {
        name: "last_name",
        message: "What is the employee's last name?",
        validate: (input) => input !== "" || "Name cannot be empty.",
      },
      {
        type: "list",
        name: "role_id",
        pageSize: 15,
        message: "What is the employee's role?",
        choices: await rolesFind(),
      },
      {
        type: "list",
        name: "manager_id",
        message: "Who is the employee's manager?",
        pageSize: 15,
        choices: await employeeFind().then((result) => {
          result.unshift({ value: null, name: "None" });
          return result;
        }),
      },
    ]).then((answers) => {
      employeeAdd(answers);
      employee.view("All");
    });
  },

  // Delete employee
  delete: async () => {
    inquirer.prompt({
      type: "list",
      name: "id",
      pageSize: 15,
      message: "Which employee do you want to terminate?",
      choices: await employeeFind().then((result) => {
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      if (answers.employee === null) {
        employee.menu();
      } else {
        rowDelete(["employee", "id", answers.id]);
        employee.view("All");
      }
    });
  },

  // Update employee's role
  updateRole: async () => {
    inquirer.prompt([
      {
        type: "list",
        name: "id",
        pageSize: 15,
        message: "Who is the employee?",
        choices: await employeeFind().then((result) => {
          result.unshift({ value: null, name: "Go Back" });
          return result;
        }),
      },
      {
        type: "list",
        name: "role_id",
        pageSize: 15,
        message: "What is the employee's new role?",
        choices: await rolesFind(),
        when: (answers) => answers.id != null,
      },
    ]).then((answers) => {
      console.log(answers);
      if (answers.id === null) {
        employee.menu();
      } else {
        rowUpdate(["employee", "role_id", answers.role_id, "id", answers.id]);
        employee.view("All");
      }
    });
  },

  // Update employee's manager
  updateManager: async () => {
    inquirer.prompt([
      {
        type: "list",
        name: "id",
        pageSize: 15,
        message: "Who is the employee?",
        choices: await employeeFind().then((result) => {
          result.unshift({ value: null, name: "Go Back" });
          return result;
        }),
      },
      {
        type: "list",
        name: "manager_id",
        pageSize: 15,
        message: "Who is the employee's manager?",
        choices: await employeeFind().then((result) => {
          result.unshift({ value: null, name: "None" });
          return result;
        }),
        when: (answers) => answers.id != null,
      },
    ]).then((answers) => {
      if (answers.id === null) {
        employee.menu();
      } else if (answers.id === answers.manager_id) {
        console.log("Employee cannot be its own manager");
        employee.menu();
      } else {
        rowUpdate(["employee", "manager_id", answers.manager_id, "id", answers.id]);
        employee.view("All");
      }
    });
  },
};

module.exports = employee;
