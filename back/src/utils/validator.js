/* eslint-disable require-jsdoc */
export const Categorias = [
  'Carpintería',
  'Cerrajería',
  'Electricista',
  'Fumigación',
  'Jardinería',
  'Limpieza',
  'Mascotas',
  'Mantenimiento',
  'Pintura',
  'Plomería',
  'Seguridad',
];


export function categoryValidator(category) {
  return Categorias.includes(category);
}


export function dateValidator(date) {
  return new Date().getFullYear() - date.getFullYear() >= 18;
}
