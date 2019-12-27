const Sequelize = require("sequelize");
const BlogDB = require("../config/BlogDB");
const { User } = require("./Users");

const Student = BlogDB.define("student", {




  authorId: {
    type: Sequelize.INTEGER,
    references: {
      model: Author,
      key: "id"
    }
  }
});

const PostSync = ({ force = false, author = {} } = { force: false }) => {
  Post.sync({ force })
    .then(() => {
      const postData = {
        title: "My sample Post",
        content: "sample post data",
        authorId: author.id
      };

      Post.create(postData)
        .then(result => {
          console.log(result.get());
        })
        .catch(console.error);
    })
    .catch(console.error);
};

exports.Post = Post;
exports.PostSync = PostSync;
