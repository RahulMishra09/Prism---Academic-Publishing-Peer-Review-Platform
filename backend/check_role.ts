import { Role } from './generated/prisma/index.js';
console.log('Role.EDITOR:', Role.EDITOR);
console.log('Role.ADMIN:', Role.ADMIN);
console.log('Is ADMIN in [Role.EDITOR, Role.ADMIN]?', [Role.EDITOR, Role.ADMIN].includes("ADMIN"));
console.log('Is ADMIN in [Role.EDITOR, Role.ADMIN]?', [Role.EDITOR, Role.ADMIN].includes("admin"));
