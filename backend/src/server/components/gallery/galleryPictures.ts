import * as fs from 'fs';
import { Gallery } from './galleryInterface';


export class Pictures {
  private static apiImagesPath: string = '/Users/user/projects/module2/module2_part2_gallery/resources/api_images';
  private static picturesPerPage: number = 4;

  static async getPictures () {
    const fileNames = await fs.promises.readdir(Pictures.apiImagesPath);
    return fileNames;
  }
  
  static countTotalPagesAmount (pictures: string[]): number {
    const picturesTotal = pictures.length;
    let totalPages: number;
  
    if (picturesTotal % Pictures.picturesPerPage === 0 ) {
      totalPages = Math.floor(picturesTotal / Pictures.picturesPerPage);
    } else {
      totalPages = Math.floor(picturesTotal / Pictures.picturesPerPage) + 1;
    }
  
    return totalPages;
  }
  
  static createGalleryResponse (objects: string[], total: number, page: number): Gallery {
    const objectsTraversePattern = objects.slice((page - 1) * Pictures.picturesPerPage, page * Pictures.picturesPerPage);
    const response: Gallery = {
      objects: objectsTraversePattern,
      total,
      page
    }
  
    return response;
  }

}














