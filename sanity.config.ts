import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './src/sanity/schemas';

export default defineConfig({
  name: 'golf-club-ops',
  title: 'Golf Club Ops',
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || '6ugn4xc7',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  plugins: [structureTool()],
  schema: {
    types: schemaTypes,
  },
});
