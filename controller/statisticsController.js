// Import dependencies
const { showCount } = require("../config/orm");
const index = require("../index");

const statistics = {
  count: async () => {
    await showCount().then((result) => {
      // console.log(result);
      console.table([{
        Name: "Employees",
        Entries: result[0].count,
      },
      {
        Name: "Roles",
        Entries: result[1].count,
      },
      {
        Name: "Departments",
        Entries: result[2].count,
      },
      ]);
      index.menu();
    });
  },
};

module.exports = statistics;
