import { ApolloServer, gql } from 'apollo-server-micro';
import { getAllPosts, getPostBySlug } from '../../lib/api';

const typeDefs = gql`
	type Query {
		posts: [Post!]!
		post(slug: String!): Post!
	}
	type Author {
		name: String
		picture: String
	}
	type ogImage {
		url: String
		secure_url: String
		type: String
		width: String
		height: String
		alt: String
	}
	type Post {
		title: String
		excerpt: String
		date: String
		slug: String
		author: Author
		content: String
		ogImage: ogImage
		coverImage: String
	}
`;

const resolvers = {
	Query: {
		posts(parent, args, context) {
			return getAllPosts(['title', 'excerpt', 'date', 'slug', 'author', 'content', 'ogImage', 'coverImage']);
		},
		post(parent, args, content) {
			return getPostBySlug(args.slug, ['title', 'excerpt', 'date', 'slug', 'author', 'content', 'ogImage', 'coverImage']);
		},
	},
};

const apolloServer = new ApolloServer({ typeDefs, resolvers });

export const config = {
	api: {
		bodyParser: false,
	},
};

export default apolloServer.createHandler({ path: '/api/graphql' });
