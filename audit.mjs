import fs from 'fs';
import path from 'path';

const SRC_DIR = './';
const files = [];

function walkDir(dir) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (['node_modules', '.next', '.git'].includes(file)) continue;
      walkDir(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      files.push(fullPath);
    }
  }
}
walkDir(SRC_DIR);

const contents = new Map();
for (const file of files) {
  contents.set(file, fs.readFileSync(file, 'utf8'));
}

function findUsages(searchString) {
  const usages = [];
  for (const [file, content] of contents.entries()) {
    if (content.includes(searchString)) {
      usages.push(file);
    }
  }
  return usages;
}

const unusedHooks = [];
const unusedServices = [];

// check hooks
for (const file of files) {
  if (file.includes('hooks\\') || file.includes('hooks/')) {
    const hookName = path.basename(file, '.ts');
    const usages = findUsages(hookName);
    if (usages.length <= 1) { // 1 for itself
      unusedHooks.push(hookName);
    }
  }
}

// check services
for (const file of files) {
  if (file.includes('services\\') || file.includes('services/')) {
    const content = contents.get(file);
    const match = content.match(/(?:class|const) (\w+Service)/);
    if (match) {
        const name = match[1];
        const usages = findUsages(name);
        if (usages.length <= 1) {
            unusedServices.push(name);
        }
    }
  }
}

console.log("Unused Hooks:", unusedHooks);
console.log("Unused Services:", unusedServices);
