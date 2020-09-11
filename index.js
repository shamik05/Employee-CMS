const orm = require("./config/orm.js");
const inquirer = require("inquirer");
const cTable = require("console.table");
const role = require("./controller/roleController.js");
const employee = require("./controller/employeeController.js");
const { departmentFind } = require("./config/orm.js");

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

// Deletes role
const rolesDelete = async () => {
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
}

// Update Role's Title, Salary or Department
const rolesUpdate = async() => {
  const roleSubMenu = await inquirer.prompt({
    type: "list",
    name: "subMenu",
    message: "Which role do you want to update?",
    choices: [{value: null, name: "Go Back"},{value: "title", name: "Update Title"},{value: "salary", name: "Update Salary"},{value: "department", name: "Update Department"}]
  })
  console.log(roleChoice);
  if(roleSubMenu.subMenu === null) {
    menu();
  } 
  await inquirer.prompt({

  })
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
};

// Main menu 
const menu = () => {
  inquirer.prompt({
    name: "menu",
    type: "list",
    message: "What would you like to do?",
    choices: [
      "Employee Management",
      "Role Management",
      "Department Management",
      "Exit",
    ],
  }).then(answer => {
    switch (answer.menu) {
    case "Employee Management":
      employee.menu();
      break;
    case "Role Management":
      role.menu();
      break;
    case "Department Management":
      break;
    default:
      console.log("Exiting");
      connection.end();
      break;
    };
  });
};

menu();

module.exports.menu = menu;