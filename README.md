# Project Name

## Tech Stack
- Next.js
- ShadCN
- Convex (BaaS)

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

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### 3. Environment Variables
To connect to the backend, you'll need to add the necessary environment variables to your `.env.local` file. Add the following to your `.env.local` file:

```bash
CONVEX_DEPLOYMENT=dev:warmhearted-clam-797
NEXT_PUBLIC_CONVEX_URL=https://warmhearted-clam-797.convex.cloud
```

### 4. Build the Application
To create an optimized production build, use the following command:

```bash
npm run build
```

## Learn More

To learn more about Next.js and Convex, take a look at the following resources:

- [Next.js](https://nextjs.org/docs)
- [Shadcn/ui](https://ui.shadcn.com/docs/installation)
- [Convex](https://docs.convex.dev/home)

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
