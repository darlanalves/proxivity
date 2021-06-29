import { createServer, IncomingMessage, ServerResponse } from 'http';
import { spawnSync as sh } from 'child_process';
import { readFileSync, existsSync, createReadStream } from 'fs';
import * as Path from 'path';

const networkSetup = sh('which', ['networksetup'], { encoding: 'utf8' }).stdout.trim();

console.log('using', networkSetup);

createServer(main).listen(process.env.PORT || 1234);

function main(request: IncomingMessage, response: ServerResponse) {
  const url = request.url.slice(1);
  const file = Path.join(process.cwd(), url);

  if (url && existsSync(file)) {
    createReadStream(file).pipe(response);
    return;
  }

  switch (true) {
    case url === '':
      const index = readFileSync(Path.join(process.cwd(), 'index.html'));
      response.writeHead(200, 'OK');
      response.write(index);
      break;

    case url.startsWith('list'):
      {
        const list = sh(networkSetup, ['-listlocations'], { encoding: 'utf8' }).stdout.trim().split('\n');

        response.writeHead(200, 'OK');
        response.write(JSON.stringify(list));
      }
      break;

    case url.startsWith('active'):
      {
        const item = sh(networkSetup, ['-getcurrentlocation'], { encoding: 'utf8' }).stdout.trim();

        response.writeHead(200, 'OK');
        response.write(item);
      }
      break;

    case url.startsWith('switch'):
      {
        const location = url.slice(7);
        sh(networkSetup, ['-switchtolocation', location]);

        response.writeHead(200, 'OK');
      }
      break;

    default:
      response.writeHead(404, 'nope');
  }

  response.end();
}
