// Import dependencies
const { showCount } = require("../config/orm");
const index = require("../server");

// Functions related to statistics submenu
const statistics = {
  // Shows totals for each table
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
      // Return to main menu after displaying result
      index.menu();
    });
  },
};

// Export module
module.exports = statistics;
