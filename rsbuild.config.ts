import { defineConfig } from '@rsbuild/core';
import { pluginReact } from '@rsbuild/plugin-react';

const PORT = Number(process.env.PORT) || 5001;
const isDocker = process.env.NODE_ENV === 'development' && process.env.DOCKER === 'true';

export default defineConfig({
    plugins: [pluginReact()],
    server: {
        port: PORT,
        open: !isDocker, // Don't open browser in Docker
    },
    source: {
        define: {
            'API_URL': JSON.stringify(process.env.API_URL || 'http://localhost:3000'),
        },
    },
});
