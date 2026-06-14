import * as React from "react"
import { Search as SearchIcon } from "lucide-react"
import { Input, type InputProps } from "./input"
import { cn } from "../../lib/utils"

export interface SearchProps extends InputProps {
  onSearch?: (value: string) => void
}

const Search = React.forwardRef<HTMLInputElement, SearchProps>(
  ({ className, onSearch, onChange, ...props }, ref) => {
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      onChange?.(e)
      onSearch?.(e.target.value)
    }

    return (
      <div className={cn("relative", className)}>
        <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          type="search"
          className="pl-9"
          onChange={handleChange}
          ref={ref}
          {...props}
        />
      </div>
    )
  }
)
Search.displayName = "Search"

export { Search }
