"use client"

import { InputGroup, InputGroupAddon, InputGroupInput } from "@/components/ui/input-group"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Eye, EyeOff } from "lucide-react"
import type { ControllerRenderProps, FieldValues, FieldPath } from "react-hook-form"

type PasswordInputProps<T extends FieldValues> = {
  field: ControllerRenderProps<T, FieldPath<T>>
  loading?: boolean
  placeholder?: string
  invalid?: boolean
  id?: string
}

export function PasswordInput<T extends FieldValues>({
  field,
  loading = false,
  placeholder,
  invalid = false,
  id,
}: PasswordInputProps<T>) {
  const [showPassword, setShowPassword] = useState<boolean>(false)

  return (
    <InputGroup data-disabled={loading} data-invalid={invalid}>
      <InputGroupInput
        {...field}
        id={id}
        type={showPassword ? "text" : "password"}
        disabled={loading}
        autoComplete="off"
        placeholder={placeholder}
        aria-invalid={invalid}
      />
      {field.value && (
        <InputGroupAddon align="inline-end">
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="mr-0.75 size-6"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <EyeOff className="size-4 cursor-default" />
            ) : (
              <Eye className="size-4 cursor-default" />
            )}
          </Button>
        </InputGroupAddon>
      )}
    </InputGroup>
  )
}
