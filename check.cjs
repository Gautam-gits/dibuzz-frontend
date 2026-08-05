const fs = require('fs');
const path = require('path');

function checkFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const regex = /import.*from\s+['"]([^'"]+)['"]/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    let importPath = match[1];
    if (importPath.startsWith('.')) {
      let absolutePath = path.resolve(path.dirname(filePath), importPath);
      let exts = ['.js', '.jsx', ''];
      let found = false;
      for (let ext of exts) {
        let p = absolutePath + ext;
        if (fs.existsSync(p) && fs.statSync(p).isFile()) {
          const dir = path.dirname(p);
          const base = path.basename(p);
          const realFiles = fs.readdirSync(dir);
          if (!realFiles.includes(base)) {
            console.log(`CASE ERROR: ${filePath}: ${importPath} -> ${p}`);
          }
          found = true;
          break;
        }
      }
      if (!found) {
        console.log(`NOT FOUND: ${filePath}: ${importPath}`);
      }
    }
  }
}

function traverse(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      traverse(fullPath);
    } else if (fullPath.endsWith('.js') || fullPath.endsWith('.jsx')) {
      checkFile(fullPath);
    }
  }
}

traverse('./src');
