# A dynamically generated blog example using Next.js and Markdown and GraphQL

This example showcases Next.js's [Server-side Rendering](https://nextjs.org/docs/basic-features/pages#server-side-rendering) feature using markdown files as the data source.

The blog posts are stored in `/_posts` as markdown files with front matter support. Adding a new markdown file in there will create a new blog post.

To create the blog posts we use [`remark`](https://github.com/remarkjs/remark) and [`remark-html`](https://github.com/remarkjs/remark-html) to convert the markdown files into an HTML string, and then send it down as a prop to the page. The metadata of every post is handled by [`gray-matter`](https://github.com/jonschlinkert/gray-matter) and also sent in props to the page.

## How to use

### Clone the repo

```bash
git clone https://github.com/dialoghmari/nextjs-dynamic-markdown-blog.git
cd nextjs-dynamic-markdown-blog
```

Install dependencies and run the example:

```bash
npm install
npm run dev

# or

yarn install
yarn dev
```

Your blog should be up and running on [http://localhost:3000](http://localhost:3000)!

## Main changes

The main problem with vercel's provided template is that pages are generated statically and we can not use getServerSideProps because of filesystem permissions (and also because fs is only available on the server side).  
So my idea was to create a GraphQL server that provide us the content of markdown files, so we can fetch it on the getServerSideProps of the post page.

So first I created the query :

```javascript
type Query {
		posts: [Post!]!
		post(slug: String!): Post!
	}
```

and then I used functions provided by vercel example to create resolvers

```javascript
const resolvers = {
	Query: {
		posts(parent, args, context) {
			return getAllPosts(['title',...]);
		},
		post(parent, args, content) {
			return getPostBySlug(args.slug, ['title',...]);
		},
	},
};
```

and finally I fetched data on my getServerSideProps function

```javascript
export async function getServerSideProps({ params, req }) {
	const query = `{
		post(slug: "${params.slug}"){
		  title,
		  date,
		  slug,
		  ...
		}
	  }`;
	let response = await fetch(graphqlUrl, {...,
		body: JSON.stringify({ query }),
	})
		.then((res) => res.json())
		.then((json) => json.data);
	let post = response.post;
	const content = await markdownToHtml(post.content || '');

	return {
		props: {
			post: {
				...post,
				content,
			},
		},
	};
}
```

## Demo & edit

You can import this project to [codesandbox](https://codesandbox.io/) to edit it.

## Deploy your own

Deploy the example using [Vercel](https://vercel.com?utm_source=github&utm_medium=readme&utm_campaign=next-example):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/import/git?c=1&s=https://github.com/dialoghmari/nextjs-dynamic-markdown-blog)

# Notes

This blog-starter uses

-   [Tailwind CSS](https://tailwindcss.com). To control the generated stylesheet's filesize, this example uses Tailwind CSS' v1.4 [`purge` option](https://tailwindcss.com/docs/controlling-file-size/#removing-unused-css) to remove unused CSS.
-   [GraphQL](https://graphql.org/) to serve markdown files' content.

## Related work

-   [A statically generated blog example using Next.js and Markdown](https://github.com/vercel/next.js/tree/canary/examples/blog-starter)
