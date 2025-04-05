# Project Name

## Tech Stack

### 1. [Next.js](https://nextjs.org/docs)

Next.js is an excellent choice for building modern web applications due to its powerful features and developer-friendly ecosystem. Here are the reasons I chose Next.js:

   - **Server-Side Rendering (SSR) and Static Site Generation (SSG)**: Next.js enables optimized performance through SSR and SSG, improving SEO and page load times. This flexibility allows for building both dynamic and static content seamlessly, making it ideal for scalable projects.
   - **Built-in API Routes**: Instead of needing to configure a separate backend for simple API interactions, Next.js allows you to create API routes directly within the app. This streamlines development and ensures a more cohesive architecture.

### 2. [Shadcn/ui](https://ui.shadcn.com/docs/installation)

ShadCN is a design system and component library that helps quickly build modern, customizable, and accessible UIs. It stands out for the following reasons:

   - **Pre-built Components**: ShadCN provides a wide variety of pre-built, customizable components, allowing for faster UI development without sacrificing quality or flexibility.
   - **Design Consistency**: By using ShadCN, you get access to a consistent and well-maintained design system, reducing the need to reinvent common UI elements.
   - **Integration with Next.js**: ShadCN integrates seamlessly with Next.js, making it easy to create beautiful and responsive designs within the app without having to deal with external dependencies or configuration.

### 3. [Convex](https://docs.convex.dev/home)

Convex provides Backend-as-a-Service (BaaS), offering a comprehensive solution to manage serverless databases, authentication, and real-time data synchronization. Here's why I chose Convex:

   - **Simplified Backend Development**: Convex abstracts away the complexities of managing server-side infrastructure, allowing developers to focus on building the application rather than dealing with backend configurations or scaling concerns.
   - **Real-time Data**: Convex provides easy-to-use real-time data synchronization, which is crucial for building interactive applications with live updates, such as chat apps, notifications, or collaborative features.
   - **Scalable**: With Convex, scaling the backend is handled automatically. This allows the application to grow without worrying about infrastructure changes or performance bottlenecks.
   - **Tight Integration with Next.js**: Convex seamlessly integrates with Next.js, making it easy to implement serverless functions, real-time data fetching, and authentication, which further accelerates development.

## Setup Instructions

### 1. Install Dependencies
To get started, run the following command to install all the necessary dependencies:

```bash
npm install
```

### 2. Run the Development Server
Once the dependencies are installed, start the development server with:

```bash
npm run dev
```

### 3. Environment Variables
To connect to the backend, you'll need to add the necessary environment variables to your `.env.local` file. Add the following to your `.env.local` file:

```
CONVEX_DEPLOYMENT=dev:warmhearted-clam-797
NEXT_PUBLIC_CONVEX_URL=https://warmhearted-clam-797.convex.cloud
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 4. Build the Application
To create an optimized production build, use the following command:

```bash
npm run build
```
