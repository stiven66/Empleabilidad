import { SetMetadata } from '@nestjs/common';

export type Role = 'ADMIN' | 'GESTOR' | 'CODER';
export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]) => SetMetadata(ROLES_KEY, roles);

// Definimos decorador personalizado @Roles que sirve para marcar qué roles 
// tienen permiso de acceder a cada endpoint en mi plataforma.