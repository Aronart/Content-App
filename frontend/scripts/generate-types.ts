const { generate } = require('openapi-typescript-codegen');
const path = require('path');
const { fileURLToPath } = require('url');

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function generateTypes() {
  try {
    await generate({
      input: `${API_URL}/openapi.json`,
      output: path.resolve(__dirname, '../types/generated'),
      exportCore: true,
      exportServices: true,
      exportModels: true,
      exportSchemas: true,
      indent: "2",
    });
    console.log('✅ Successfully generated TypeScript types from OpenAPI schema');
  } catch (error) {
    console.error('❌ Failed to generate TypeScript types:', error);
    process.exit(1);
  }
}

generateTypes();