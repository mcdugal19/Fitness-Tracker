// require and re-export all files in this db directory (users, activities...)
module.exports = {
  ...require("./users"),
  ...require("./routines"),
  ...require("./activities"),
  ...require("./routine_activities"),
};
