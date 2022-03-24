import { PageFileReader as reader} from './server/static/pageFileReader';
import { createServer } from "http";
import { parse } from "url";
import { Authentication } from "./server/components/authentication/authentication";
import { User } from "./modules/user";
import { Pictures as pictures } from "./server/components/gallery/galleryPictures";
import { token, errorMessage } from "./modules/serverVariables";
import { config } from "dotenv";

config();

const server = createServer((req, res) => {
  const requestBase = `${process.env.PROTOCOL}://${req.headers.host}`;
  
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

  if (new URL(req.url!, requestBase).pathname === '/gallery') {
    console.log(new URL(req.url!, `${process.env.PROTOCOL}://${req.headers.host}`));
    if (req.method === 'GET') {
      if (req.headers.authorization === 'token') {
        const requestUrlParams = parse(req.url!, true).query;
        let currentPage = requestUrlParams['page'] ? Number(requestUrlParams['page']) : 1;

        pictures.getPictures()
          .then(fileNames => {
            const pictureNames = fileNames;
            const totalPagesAmount = pictures.countTotalPagesAmount(pictureNames);

            if (currentPage <= totalPagesAmount && currentPage > 0) {
              const response = pictures.createGalleryResponse(pictureNames, totalPagesAmount, currentPage);

              res.writeHead(200, {'Content-Type': 'application/json'});
              res.end(JSON.stringify(response));
            }
        }) 
      } else {
        res.writeHead(403, {'Content-Type': 'application/json'})
        res.end(JSON.stringify({message: 'forbidden'}));
      }
    }
  }   

  reader.getTargetPageFile(req, res);
})

server.listen(Number(process.env.PORT) || 8080);
