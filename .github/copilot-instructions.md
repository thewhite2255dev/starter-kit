## Import paths

Always use the `@/` alias for all imports in this Next.js project.
Never use relative paths that go up directories (e.g. `../`, `../../`).

Rules:

- `@/` maps to the root of the project (as defined in tsconfig.json paths)
- Imports within the same folder must use `./` (e.g. `./helper`)
- Imports from any other folder must always use `@/`

Examples:
// ✅ Correct
import { Button } from "@/components/next-editor/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { cn } from "@/lib/utils";

// ❌ Incorrect
import { Button } from "../../components/next-editor/ui/button";
import { useAuth } from "../hooks/useAuth";
