#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get current folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Get project name
const projectName = process.argv[2];
if (!projectName) {
  console.error(
    'Please provide a project name: npx create-fshield-app myapp',
  );
  process.exit(1);
}

const targetDir = path.join(process.cwd(), projectName);

// Copy template
fs.mkdirSync(targetDir);
fs.cpSync(path.join(__dirname, '../templates'), targetDir, { recursive: true });

console.log('Project created successfully!');
console.log(`> cd ${projectName}`);
console.log('> npm install');
console.log('> npm run dev');
