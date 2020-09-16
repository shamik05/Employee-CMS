// Imports the connection details and the modified mysql functions
const db = require("./connection.js");

// Handles any database queries and results
const orm = {

  // Lists all employees. Type argument specifies ordering by department or manager or default id
  employeeView: async (type) => {
    try {
      // Define variable to be used in query
      let order;
      // Check which ordering to return
      switch (type) {
      // Department View
      case "Department":
        order = "D.name asc";
        break;
      // Manager View
      case "Manager":
        order = "Manager asc";
        break;
      // Default employee id view
      default:
        order = "E.id";
        break;
      }
      // Query to show employee id, first and last name, role, department and manager
      const query = `SELECT E.id AS ID, E.first_name AS "First Name", E.last_name AS "Last Name", IFNULL(R.title, "Unassigned") AS "Role", IFNULL(D.name, "Unassigned") AS "Department", IFNULL(R.salary, "Unassigned") AS "Salary ($)", IFNULL(concat(M.first_name, " ", M.last_name),"Unassigned") AS "Manager" 
      FROM employee AS E 
      LEFT JOIN role AS R ON E.role_id = R.id 
      LEFT JOIN department AS D ON R.department_id = D.id
      LEFT JOIN employee AS M ON E.manager_id = M.id
      ORDER BY ${order}`;
      // Returns the result as a promise to be used by our controller
      return await db.query(query);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Lists all employees for the list in the inquirer prompt
  employeeFind: async () => {
    try {
      // Query to show employee id as value and employee name as display
      const query = "SELECT id AS value, concat(first_name, \" \", last_name) AS name FROM employee ORDER BY last_name ASC";
      // Returns the result as a promise to be used by our controller
      return await db.query(query);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Adds an employee based on inquirer answers
  employeeAdd: async (answers) => {
    try {
      // Query to insert employee by first name, last name, role and manager
      const query = "INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)";
      // Returns the result as a promise to be used by our controller
      return await db.query(query, [...Object.values(answers)]);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // General function to delete a row from any table based on primary id passed as arg
  rowDelete: async (answers) => {
    try {
      // Query to use
      const query = "DELETE FROM ?? where ?? = ?";
      // Returns the result as a promise to be used by our controller
      return await db.query(query, answers);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // General function to update a row from any table based on inquirer answers
  rowUpdate: async (answers) => {
    try {
      // Query to use
      const query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      // Returns the result as a promise to be used by our controller
      return await db.query(query, answers);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Function to list all roles for the list in the inquirer prompt
  rolesFind: async () => {
    try {
      // Query to show role id as value and role title as display
      const query = "SELECT id AS value, title AS name FROM role ORDER BY title ASC";
      // Returns the result as a promise to be used by our controller
      return await db.query(query);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Shows all roles ordered by column name passed as argument
  rolesView: async (type) => {
    try {
      // Query to display role id, title, salary and department name
      const query = `SELECT role.id AS "ID", title AS "Title", salary AS "Salary ($)", IFNULL(department.name, "Unassigned") AS "Department" FROM role LEFT JOIN department 
      ON role.department_id = department.id
      ORDER BY ?? asc`;
      // Returns the result as a promise to be used by our controller
      return await db.query(query, type);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Adds a role based on inquirer answers
  rolesAdd: async (answers) => {
    try {
      // Query to insert role by title, salary and department
      const query = "INSERT INTO role(??, ??, ??) values(?,?,?)";
      // Returns the result as a promise to be used by our controller
      return await db.query(query, [...Object.keys(answers), ...Object.values(answers)]);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Lists all departments for the list in the inquirer prompt
  departmentFind: async () => {
    try {
      // Query to show department id as value and department name as display
      const query = "SELECT id AS value, name FROM department ORDER BY name ASC";
      // Returns the result as a promise to be used by our controller
      return await db.query(query);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Shows all departments ordered by department id
  departmentView: async () => {
    try {
      // Query to show department id, name, current budget and current employees
      const query = `SELECT department.id AS "ID", name AS "Name", ifnull(sum(salary), 0) AS "Budget($)", count(employee.id) AS "Employees" from employee 
      LEFT JOIN role 
      ON employee.role_id = role.id
      RIGHT JOIN department
      ON department_id = department.id
      GROUP BY department.name
      ORDER BY department.id`;
      // Returns the result as a promise to be used by our controller
      return await db.query(query);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Adds a department based on inquirer answers
  departmentAdd: async (answers) => {
    try {
      // Query to insert department by name
      const query = "INSERT INTO department(??) values(?)";
      // Returns the result as a promise to be used by our controller
      return await db.query(query, answers);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Shows all roles based on the department passed as argument
  departmentViewRoles: async (answers) => {
    try {
      // Query to show department id, name, its roles and respective salary
      const query = `SELECT department.id as "ID", name as "Name", title as "Role Title", salary as "Salary"  
      FROM department
      RIGHT JOIN role
      ON department.id = role.department_id
      WHERE department.id = ?`;
      // Returns the result as a promise to be used by our controller
      return await db.query(query, answers);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Shows all employees based on the department passed as argument
  departmentViewEmployees: async (answers) => {
    try {
      // Query to show employee id, name and role
      const query = `SELECT employee.id AS "ID", concat(first_name, " ", last_name) AS "Name", title AS "Title" FROM employee 
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON role.department_id = department.id
      WHERE department.id = ?
      ORDER BY employee.id`;
      // Returns the result as a promise to be used by our controller
      return await db.query(query, answers);
    } catch (error) {
      // Error handling
      if (error) throw error;
      return false;
    }
  },

  // Shows count of ids for each table
  showCount: async () => {
    try {
      const query = `select count(id) as "count" from employee union
      select count(id) from role union
      select count(id) from department`;
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
};

// Exports all orm functions
module.exports = orm;
