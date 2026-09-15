import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {schemaTypes} from './schemaTypes'

const shared = {
  projectId: 'kavbcyru',
  studioHost: 'lrnutrition',
  plugins: [structureTool()],
  schema: { types: schemaTypes },
};


export default defineConfig([
  { ...shared, name: 'production', title: 'Production', dataset: 'production', basePath: '/production' },
  { ...shared, name: 'development', title: 'Development', dataset: 'development', basePath: '/development' },
]);
