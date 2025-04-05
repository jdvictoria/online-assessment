"use client";

import { ConvexProvider, ConvexReactClient } from "convex/react";
import { ReactNode } from "react";

// Initialize the Convex client using the URL from environment variables
const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

/**
 * ConvexClientProvider component.
 * This component wraps the application with the ConvexProvider, which makes
 * the Convex client available throughout the component tree.
 *
 * @param {ReactNode} children - The child components to be wrapped by the ConvexProvider.
 * @returns {JSX.Element} The ConvexProvider component with children.
 */
export function ConvexClientProvider({ children }: { children: ReactNode }) {
  return <ConvexProvider client={convex}>{children}</ConvexProvider>;
}
