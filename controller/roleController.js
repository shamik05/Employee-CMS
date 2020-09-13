const inquirer = require("inquirer");
const {
  rolesView, rolesAdd, departmentFind, rolesFind, rowDelete, rowUpdate,
} = require("../config/orm");
const index = require("../index");

const role = {
  // Role Management Menu
  menu: async () => {
    inquirer.prompt({
      name: "menu",
      type: "list",
      message: "What would you like to do?",
      choices: [
        "View Roles by ID",
        "View Roles by Title",
        "View Roles by Salary",
        "View Roles by Department",
        "Add Role",
        "Remove Role",
        "Update Role",
        "Go Back",
      ],
    })
      .then((answers) => {
        switch (answers.menu) {
        case "View Roles by ID":
          role.view("role.id");
          break;
        case "View Roles by Title":
          role.view("title");
          break;
        case "View Roles by Salary":
          role.view("salary");
          break;
        case "View Roles by Department":
          role.view("department");
          break;
        case "Add Role":
          role.add();
          break;
        case "Remove Role":
          role.delete();
          console.log(answers.menu);
          break;
        case "Update Role":
          role.update();
          break;
        default:
          index.menu();
          break;
        }
      });
  },
  // View all roles
  view: async (type) => {
    rolesView(type).then((result) => {
      console.log("\n\n");
      console.table(result);
    });
    role.menu();
  },
  // Adds role
  add: async () => {
    inquirer.prompt([
      {
        name: "title",
        message: "What is the role title?",
        validate: (input) => input !== "" || "Title cannot be empty.",
      },
      {
        name: "salary",
        message: "What is the role salary?",
        validate: (input) => {
          if (isNaN(input)) {
            return "Id has to be a number.";
          }
          if (input < 0) {
            return "Id has to be a positive number.";
          }
          if (input === "") {
            return "Id cannot be empty.";
          }
          return true;
        },
      },
      {
        type: "list",
        name: "department_id",
        message: "What is the employee's role?",
        choices: await departmentFind(),
      },
    ]).then((answers) => {
      rolesAdd(answers);
      role.view("role.id");
    });
  },

  // Deletes role
  delete: async () => {
    inquirer.prompt({
      type: "list",
      name: "id",
      message: "Which role do you want to remove?",
      choices: await rolesFind().then((result) => {
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      if (answers.id === null) {
        role.menu();
      } else {
        rowDelete(["role", "id", answers.id]);
        role.view("role.id");
      }
    });
  },
  // Update Role's Title, Salary or Department
  update: async () => {
    const roleUpdate = await inquirer.prompt(
      {
        type: "list",
        name: "id",
        message: "Which role do you want to update?",
        pageSize: 15,
        choices: await rolesFind().then((result) => {
          result.unshift({ value: null, name: "Go Back" });
          return result;
        }),
      },
    );

    if (roleUpdate.id === null) {
      role.menu();
    } else {
      const column = await inquirer.prompt({
        type: "list",
        name: "name",
        message: "Which do you want to update?",
        choices: [{ value: "title", name: "Update Title" }, { value: "salary", name: "Update Salary" }, { value: "department", name: "Update Department" }, { value: null, name: "Go Back" }],
      });
      if (column.name === null) {
        role.update();
      } else if (column.name === "department") {
        inquirer.prompt(
          {
            type: "list",
            name: "department",
            message: "Which role do you want to update?",
            pageSize: 15,
            choices: await departmentFind(),
          },
        ).then((answers) => {
          rowUpdate(["role", "department_id", answers.department, "id", roleUpdate.id]);
          role.view("role.id");
        });
      } else {
        inquirer.prompt({
          type: "input",
          name: "value",
          message: `What is the new role's ${column.name}`,
        }).then((answers) => {
          rowUpdate(["role", column.name, answers.value, "id", roleUpdate.id]);
          role.view("role.id");
        });
      }
    }
  },
};

module.exports = role;
