"use client"

import { debounce, parseAsString, parseAsInteger, useQueryState } from "nuqs"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Search, X } from "lucide-react"

export function SearchInput({
  placeholder,
  queryState = true,
  value,
  setValue,
}: {
  placeholder?: string
  queryState?: boolean
  value?: string
  setValue?: (value: string) => void
}) {
  const [query, setQuery] = useQueryState(
    "s",
    parseAsString.withDefault("").withOptions({ shallow: false })
  )
  const [, setPage] = useQueryState(
    "page",
    parseAsInteger.withDefault(1).withOptions({ shallow: false })
  )

  if (!queryState) {
    return (
      <InputGroup className="rounded-none border-0 bg-transparent py-7.25 has-[[data-slot=input-group-control]:focus-visible]:ring-[0px]">
        <InputGroupAddon>
          <InputGroupButton className="pointer-events-none ml-0 pl-2.5">
            <Search className="size-4" />
          </InputGroupButton>
        </InputGroupAddon>
        <InputGroupInput
          autoFocus
          value={value ?? ""}
          onChange={(e) => setValue?.(e.target.value)}
          placeholder={placeholder}
        />
        {value !== "" && (
          <InputGroupAddon align="inline-end" className="mr-0 pr-2.5">
            <InputGroupButton onClick={() => setValue?.("")} className="hover:bg-transparent">
              <X className="size-4" />
            </InputGroupButton>
          </InputGroupAddon>
        )}
      </InputGroup>
    )
  }

  return (
    <InputGroup className="flex-1">
      <InputGroupAddon>
        <InputGroupButton className="pointer-events-none">
          <Search />
        </InputGroupButton>
      </InputGroupAddon>
      <InputGroupInput
        value={query ?? ""}
        onChange={(e) => {
          setPage(1)
          setQuery(e.target.value, {
            limitUrlUpdates: e.target.value === "" ? undefined : debounce(300),
          })
        }}
        placeholder={placeholder}
      />
      {query !== "" && (
        <InputGroupAddon align="inline-end">
          <InputGroupButton
            onClick={() => {
              setPage(1)
              setQuery("")
            }}
          >
            <X />
          </InputGroupButton>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
