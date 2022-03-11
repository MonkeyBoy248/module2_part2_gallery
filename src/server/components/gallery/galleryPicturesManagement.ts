import * as fs from 'fs';
import { Gallery } from './gallery';

export const apiImagesPath = 'resources/api_images';
const picturesPerPage = 4;

export async function getPictures (path: string) {
  const files = await fs.promises.readdir(path);
  return files;
}

export function countTotalPagesAmount (pictures: string[]): number {
  const picturesTotal = pictures.length;
  let totalPages: number;

  if (picturesTotal % picturesPerPage === 0 ) {
    totalPages = Math.floor(picturesTotal / picturesPerPage);
  } else {
    totalPages = Math.floor(picturesTotal / picturesPerPage) + 1;
  }

  return totalPages;
}

export function createGalleryResponse (objects: string[], total: number, page: number): Gallery {
  const response: Gallery = {
    objects: objects.slice((page - 1) * picturesPerPage, page * picturesPerPage),
    total: total,
    page: page
  }

  return response;
}












