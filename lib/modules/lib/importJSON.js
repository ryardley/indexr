import fs from 'fs';

export default (jsonPath) => JSON.parse(fs.readFileSync(jsonPath, 'utf-8'));
