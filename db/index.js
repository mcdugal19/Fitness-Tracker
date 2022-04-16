// require and re-export all files in this db directory (users, activities...)


module.exports = {
  client: require('./client'),
  Activities: require('./activities'),
  Routine_activities: require('./routine_activities'),
  Routines: require('./routines'),
  Seed: require('./seed'),
  SeedData: require('./seedData'),
  Users: require('./users'),

};
