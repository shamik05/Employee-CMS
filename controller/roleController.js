const inquirer = require("inquirer");
const {
  rolesView, rolesAdd, departmentFind, employeeFind, employeeDelete,
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
        "View Roles",
        "Add Role",
        "Remove Role",
        "Update Role",
        "Go Back",
      ],
    })
      .then((answers) => {
        switch (answers.menu) {
        case "View Roles":
          role.view();
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
  view: async () => {
    rolesView((err, result) => {
      if (err) throw err;
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
    ])
      .then((answers) => {
        rolesAdd(answers);
        role.view();
      });
  },

  // Deletes role
  delete: async () => {
    inquirer.prompt({
      type: "list",
      name: "employee",
      message: "Which employee do you want to terminate?",
      choices: await employeeFind().then((result) => {
        result.unshift({ value: null, name: "Go Back" });
        return result;
      }),
    }).then((answers) => {
      if (answers.employee === null) {
        role.menu();
      } else {
        employeeDelete(answers.employee);
        role.view("All");
      }
    });
  },
  // Update Role's Title, Salary or Department
  update: async () => {
    const roleSubMenu = await inquirer.prompt({
      type: "list",
      name: "subMenu",
      message: "Which role do you want to update?",
      choices: [{ value: null, name: "Go Back" }, { value: "title", name: "Update Title" }, { value: "salary", name: "Update Salary" }, { value: "department", name: "Update Department" }],
    });
    if (roleSubMenu.subMenu === null) {
      role.menu();
    }
    await inquirer.prompt({

    });
    // {
    //   type: "list",
    //   name: "roleChoose",
    //   message: "Which role do you want to update?",
    //   choices: await orm.rolesFind().then(result => {
    //     result.unshift({value: null, name: "Go Back"});
    //     return result;
    //     }),
    //   when: function(answers) {
    //     return answers.rolesUpdateMenu;
    //   }
    // },
    // {
    //   type: "input",
    //   name: "roleSet",
    //   message: `What is the role's newest ${answers.rolesUpdateMenu}?`,
    //   when: function(answers) {
    //     return answers.roleChoose;
    //   }
    // }
    // ]).then(answers => {
    //   console.log(answers)
    //   if (answers.rolesUpdateMenu === null){
    //     menu();
    //   }
    // })

  // if(answers.rolesUpdate === null){
  //   menu();
  // };
  // inquirer.prompt([{
    // type: "list",
    // name: "choice",
    // message: "Which role do you want to update?",
    // choices: await orm.rolesFind()
  // }]).then(answers => {console.log(answers)});
  // orm.rolesUpdate(["role", ])
  },
};

module.exports = role;
