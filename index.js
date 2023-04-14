import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// Schemas
const typeDefs = `#graphql
	type Post {
		userId: ID!
		title: String!
		content: String!
	}

	type User {
		id: ID!
		name: String!
		email: String!
		posts: [Post]
	}

	type Query {
		users: [User!]!
		user(id: ID!): User!
	}

	type Mutation {
		createPost(userId: ID!, title: String!, content: String!): Post!
		deletePost(userId: ID!, title: String!): Boolean!
		updatePost(userId: ID!, title: String!, input: PostInput!): Boolean!
		createUser(id: ID!, name: String!, email: String!): User!
		deleteUser(id: ID!): Boolean!
		updateUser(id: ID!, input: UserInput!): Boolean!
	}

	input PostInput {
		title: String
		content: String
	}

	input UserInput {
		name: String
		email: String
	}
`;

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

// Resolvers
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

// The ApolloServer constructor requires two parameters: your schema
// definition and your set of resolvers.
const server = new ApolloServer({
	typeDefs,
	resolvers,
});

// Passing an ApolloServer instance to the `startStandaloneServer` function:
//  1. creates an Express app
//  2. installs your ApolloServer instance as middleware
//  3. prepares your app to handle incoming requests
const { url } = await startStandaloneServer(server, {
	listen: { port: 4000 },
});

console.log(`🚀  Server ready at: ${url}`);
