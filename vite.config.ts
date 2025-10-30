import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import path from "path"
import { defineConfig } from "vite"

// https://vite.dev/config/
export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [["babel-plugin-react-compiler"]],
			},
		}),
		tailwindcss(),
	],
	resolve: {
		alias: {
			"@shared": path.resolve(__dirname, "./src/shared"),
			"@client": path.resolve(__dirname, "./src/client"),
			"@server": path.resolve(__dirname, "./src/server"),
		},
	},
})
