// Datas
const users = [
	{
		id: "1",
		name: "Alice",
		email: "alice@example.com",
		posts: [
			{
				title: "My First Post",
				content: "This is the content of my first post.",
			},
			{
				title: "My Second Post",
				content: "This is the content of my second post.",
			},
		],
	},
	{
		id: "2",
		name: "Bob",
		email: "bob@example.com",
		posts: [
			{
				title: "My First Post",
				content: "This is the content of my first post.",
			},
		],
	},
];

const resolvers = {
	Query: {
		users: () => users,
		user: (parent, args) => users.find((user) => user.id === args.id),
	},
	User: {
		posts: (parent, args, context, info) => {
			return parent.posts;
		},
	},
	Mutation: {
		createPost: (parent, { userId, title, content }) => {
			const user = users.find((user) => user.id === userId);
			if (!user) {
				throw new Error("User not found");
			}
			const newPost = { userId, title, content };
			user.posts.push(newPost);
			return newPost;
		},
		deletePost: (parent, { userId, title }) => {
			const user = users.find((user) => user.id === userId);
			if (!user) {
				throw new Error("User not found");
			}
			const index = user.posts.findIndex((post) => post.title === title);
			if (index !== -1) {
				user.posts.splice(index, 1);
				return true; // la suppression a réussi
			} else {
				throw new Error("Post not found");
			}
		},
		updatePost: (parent, { userId, title, input }) => {
			const user = users.find((user) => user.id === userId);
			if (!user) {
				throw new Error("User not found");
			}
			const index = user.posts.findIndex((post) => post.title === title);
			if (index !== -1) {
				user.posts[index] = { ...user.posts[index], ...input };
				return true; // la modification a réussi
			} else {
				throw new Error("Post not found");
			}
		},
		createUser: (parent, { id, name, email }) => {
			const index = users.findIndex((user) => user.id === id);
			if (index !== -1) {
				throw new Error("ID already exists");
			}
			const newUser = { id, name, email, posts: [] };
			users.push(newUser);
			return newUser;
		},
		deleteUser: (parent, { id }) => {
			const index = users.findIndex((user) => user.id === id);
			if (index !== -1) {
				users.splice(index, 1);
				return true; // la suppression a réussi
			} else {
				throw new Error("ID does not exist");
			}
		},
		updateUser: (parent, { id, input }) => {
			const index = users.findIndex((user) => user.id === id);
			if (index !== -1) {
				users[index] = { ...users[index], ...input }; // modification d'une partie de l'objet
				return true; // la modification a réussi
			} else {
				throw new Error("ID does not exist");
			}
		},
	},
};

export default resolvers;
