const { UserSync } = require("../models/Users");
const { MarkSync } = require("../models/Marks");
//const { AuthorSync } = require("../models/Authors");
//const { PostSync } = require("../models/Posts");

//UserSync({ force: true });
//.then(user => {
MarkSync({ force: true });
//});

/*
AuthorSync({ force: true }).then(author => {
  PostSync({ force: true, author });
});
*/
