
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 8080,
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Optimize build settings
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: mode === 'production',
        drop_debugger: true
      }
    },
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunks
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-ui': ['@radix-ui/react-tabs', '@radix-ui/react-toast'],
          'vendor-utils': ['@tanstack/react-query', 'next-themes', 'tailwind-merge'],
          'puzzle-core': [
            '@/components/puzzles/hooks/usePuzzleState',
            '@/components/puzzles/hooks/usePuzzlePieces',
            '@/components/puzzles/utils/pieceStyleUtils',
            '@/components/puzzles/utils/pieceRotationUtils'
          ]
        }
      }
    },
    // Improve source map generation for production debugging
    sourcemap: mode !== 'production' ? true : false
  }
}));
