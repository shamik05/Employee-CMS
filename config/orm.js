const db = require("./connection.js");

const orm = {
  selectOrder: function(type, cb){
    const query = `SELECT E.id, E.first_name AS "First Name", E.last_name AS "Last Name", R.title AS "Job Title", D.name AS Department, R.salary AS Salary, concat(M.first_name, " ", M.last_name) AS Manager 
    FROM employee AS E 
    INNER JOIN role AS R ON E.role_id = R.id 
    INNER JOIN department AS D ON R.department_id = D.id
    LEFT JOIN employee AS M ON E.manager_id = M.id
    ORDER BY ${type}`;

    db.query(query, cb);
  },
  findRoles: async () => {
    const query = `SELECT id,title FROM role ORDER BY title ASC`;
    return await db.query(query);
  },
  findMEmployees: async () => {
    const query = `SELECT id, concat(first_name, " ", last_name) AS employee FROM employee ORDER BY last_name ASC`
    return await db.query(query);
  }
};

module.exports = orm;