import * as fs from 'fs';
import { Gallery } from './galleryInterface';


export class Pictures {
  private static API_IMAGES_PATH: string = '/Users/user/projects/module2/module2_part2_gallery/resources/api_images';
  private static PICTURES_PER_PAGE: number = 4;

  static async getPictures () {
    const fileNames = await fs.promises.readdir(Pictures.API_IMAGES_PATH);
    
    return fileNames;
  }
  
  static countTotalPagesAmount (pictures: string[]): number {
    const picturesTotal = pictures.length;
    let totalPages: number;
  
    if (picturesTotal % Pictures.PICTURES_PER_PAGE === 0 ) {
      totalPages = Math.floor(picturesTotal / Pictures.PICTURES_PER_PAGE);
    } else {
      totalPages = Math.floor(picturesTotal / Pictures.PICTURES_PER_PAGE) + 1;
    }
  
    return totalPages;
  }
  
  static createGalleryResponse (objects: string[], total: number, page: number): Gallery {
    const objectsTraversePattern = objects.slice((page - 1) * Pictures.PICTURES_PER_PAGE, page * Pictures.PICTURES_PER_PAGE);
    const response: Gallery = {
      objects: objectsTraversePattern,
      total,
      page
    }
  
    return response;
  }

}














