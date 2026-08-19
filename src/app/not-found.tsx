import Link from "next/link";
import { Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-4 text-center">
      <div className="absolute inset-0 bg-gradient-village opacity-[0.05]" />
      <div className="relative">
        <p className="text-8xl font-bold text-gradient-village">404</p>
        <h1 className="mt-4 text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="mt-3 max-w-md text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or may have been moved.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Link href="/">
            <Button className="gap-2">
              <Home className="h-4 w-4" />
              Go Home
            </Button>
          </Link>
          <Link href="/search">
            <Button variant="outline" className="gap-2">
              <Search className="h-4 w-4" />
              Search Portal
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
