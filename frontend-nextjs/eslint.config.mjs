import { defineConfig, globalIgnores } from 'eslint/config'
import next from 'eslint-config-next'
import prettier from 'eslint-config-prettier/flat'

export default defineConfig([
 ...next,
 prettier,
 {
  rules: {
   'react/display-name': 'off',
   // Existing components predate React Compiler. Keep its diagnostics visible
   // without requiring a separate UI refactor in this dependency migration.
   'react-hooks/refs': 'warn',
   'react-hooks/set-state-in-effect': 'warn',
   'react-hooks/static-components': 'warn',
  },
 },
 globalIgnores(['.next/**', 'src/generated/**', 'next-env.d.ts']),
])
