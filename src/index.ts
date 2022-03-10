import { createServer } from "http";
import { parse } from "url";
import { Authentication } from "./server/components/authentication/authentication";
import { User } from "./modules/user";
import { AuthenticationErrorMessage, Token } from "./modules/tokenManagement";
import * as galleryResponse from "./server/components/gallery/galleryPicturesManagement";
import { port } from "./modules/serverVariables";
import { getTargetPageFile } from "./server/routes/routesFilesManagement";


const token: Token = {token: 'token'};
const errorMessage: AuthenticationErrorMessage = {errorMessage: 'Invalid user data'};


const server = createServer((req, res) => {
  getTargetPageFile(req, res);

  if (req.url === '/authentication') {
    if (req.method === 'POST') {
      let body: User = {
        email: '',
        password: ''
      };

      req.on('data', (chunk) => {
        body = JSON.parse(chunk);
      })

      req.on('end', () => {
        res.writeHead(200, {
          'Content-Type': 'application/json',
        });

        if (Authentication.isThisCorrectUser(body)) {
          res.end(JSON.stringify(token), 'utf-8');
        } else {
          res.end(JSON.stringify(errorMessage), 'utf-8');
        }
      })
    }
  }

  if (req.url?.includes('/gallery')) {
    if (req.method === 'GET') {
      if (req.headers.authorization === 'token') {
        const requestUrlParams = parse(req.url, true).query;
        let currentPage = requestUrlParams['page'] ? Number(requestUrlParams['page']) : 1;

        galleryResponse.getPictures(galleryResponse.apiImagesPath)
          .then(files => {
            const objects = files;
            const total = galleryResponse.countTotalPagesAmount(objects);

            if (currentPage <= total && currentPage > 0) {
              const response = galleryResponse.createGalleryResponse(objects, total, currentPage);
              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end(JSON.stringify(response));
            }
        }) 
      } else {
        res.writeHead(403, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'forbiden'}));
      }
    }
  }   
})

server.listen(port || 5000);



