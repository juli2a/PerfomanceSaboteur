import * as React from "react";
import { Search as IconSearch } from "lucide-react";

import { cn } from "@/lib/utils/cn";
import { Input } from "@/components/ui/input";

interface SearchInputProps extends Omit<React.ComponentProps<"input">, "type"> {
  containerClassName?: string;
}

function SearchInput({ className, containerClassName, ...props }: SearchInputProps) {
  return (
    <div className={cn("relative", containerClassName)}>
      <IconSearch className="pointer-events-none absolute top-1/2 left-3.75 size-4 -translate-y-1/2 text-text-3" />
      <Input
        type="search"
        className={cn("h-11 border-border bg-surface pl-9.5", className)}
        {...props}
      />
    </div>
  );
}

export { SearchInput };
