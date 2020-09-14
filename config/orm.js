const db = require("./connection.js");

const orm = {
  employeeView: async (type) => {
    try {
      let order;
      switch (type) {
      case "Department":
        order = "D.name asc";
        break;
      case "Manager":
        order = "Manager asc";
        break;
      default:
        order = "E.id";
        break;
      }
      const query = `SELECT E.id AS ID, E.first_name AS "First Name", E.last_name AS "Last Name", IFNULL(R.title, "Unassigned") AS "Role", IFNULL(D.name, "Unassigned") AS "Department", IFNULL(R.salary, "Unassigned") AS "Salary ($)", IFNULL(concat(M.first_name, " ", M.last_name),"Unassigned") AS "Manager" 
      FROM employee AS E 
      LEFT JOIN role AS R ON E.role_id = R.id 
      LEFT JOIN department AS D ON R.department_id = D.id
      LEFT JOIN employee AS M ON E.manager_id = M.id
      ORDER BY ${order}`;
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  employeeFind: async () => {
    try {
      const query = "SELECT id AS value, concat(first_name, \" \", last_name) AS name FROM employee ORDER BY last_name ASC";
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  employeeAdd: async (answers) => {
    try {
      const query = "INSERT INTO employee(first_name, last_name, role_id, manager_id) values(?,?,?,?)";
      return await db.query(query, [...Object.values(answers)]);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rowDelete: async (answers) => {
    console.log(answers);
    try {
      const query = "DELETE FROM ?? where ?? = ?";
      return await db.query(query, answers);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rowUpdate: async (answers) => {
    try {
      const query = "UPDATE ?? SET ?? = ? WHERE ?? = ?";
      return await db.query(query, answers);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rolesFind: async () => {
    try {
      const query = "SELECT id AS value, title AS name FROM role ORDER BY title ASC";
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rolesView: async (type) => {
    try {
      const query = `SELECT role.id AS "ID", title AS "Title", salary AS "Salary ($)", IFNULL(department.name, "Unassigned") AS "Department" FROM role 
    LEFT JOIN department 
    ON role.department_id = department.id
    ORDER BY ?? asc`;
      return await db.query(query, type);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  rolesAdd: async (answers) => {
    try {
      const query = "INSERT INTO role(??, ??, ??) values(?,?,?)";
      return await db.query(query, [...Object.keys(answers), ...Object.values(answers)]);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  departmentFind: async () => {
    try {
      const query = "SELECT id AS value, name FROM department ORDER BY name ASC";
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  departmentView: async () => {
    try {
      const query = `SELECT department.id AS "ID", name AS "Name", ifnull(sum(salary), 0) AS "Budget($)", count(employee.id) AS "Employees" from employee 
      LEFT JOIN role 
      ON employee.role_id = role.id
      RIGHT JOIN department
      ON department_id = department.id
      GROUP BY department.name
      ORDER BY department.id`;
      return await db.query(query);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  departmentAdd: async (answers) => {
    try {
      const query = "INSERT INTO department(??) values(?)";
      return await db.query(query, answers);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  departmentViewRoles: async (answers) => {
    try {
      const query = `SELECT department.id as "ID", name as "Name", title as "Role Title", salary as "Salary"  
      FROM department
      RIGHT JOIN role
      ON department.id = role.department_id
      WHERE department.id = ?`;
      return await db.query(query, answers);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
  departmentViewEmployees: async (answers) => {
    try {
      const query = `SELECT employee.id AS "ID", concat(first_name, " ", last_name) AS "Name", title AS "Title" FROM employee 
      LEFT JOIN role
      ON employee.role_id = role.id
      LEFT JOIN department
      ON role.department_id = department.id
      WHERE department.id = ?
      ORDER BY employee.id`;
      return await db.query(query, answers);
    } catch (error) {
      if (error) throw error;
      return false;
    }
  },
};

module.exports = orm;
