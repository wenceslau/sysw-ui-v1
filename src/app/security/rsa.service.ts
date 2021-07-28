import { Injectable } from '@angular/core';
import * as forge from 'node-forge';

//var forge = require('node-forge');

@Injectable({
  providedIn: 'root'
})
export class RsaService {

  constructor() { }


  encrypt(plaintext: string): string {

    
    let permPublicSuite = '-----BEGIN PUBLIC KEY-----' +
      'MIICIjANBgkqhkiG9w0BAQEFAAOCAg8AMIICCgKCAgEAi7b+RD8vDGmMrZvsE97GtQZGuDx1IqxOKqMZeNnEOM84bR0AHjhcMlLWahjBoM7meBCB+azdIuQPGwLes6f3WAmC9U68GUWLndLu27ngKLg2mjdzJRUgciekxtxXOnaqRK1Nks1xBUBl0JDE4xn0C4zzCDJDrPWj9J8Ms/a1p8FUqEa3KHabMvajMC5JkrUpI4e9PAuB1INjvKMM+3oRcBQHEIAHrIanY6nKrpDvWzG4YO3z5Auy5nEciCxbncG4fQ4t5kBRJAdWKiXsO9iYIGIJh6QXFL7swAqoSrjsA0IyYgTvbMuCb0vhkpAkwjOM54r05Ynyjc7VeAddpTHHZl+12Rxc2OTOyjvR92WbgnDZGAwf+c4M9N/ePL97GkvMNtWAHMd1wJ6RXgNqhw5gZ6OzZESSR2Qujo6byVTsBdKB5sTJlAK7nQ7GUZwHFnOc2WCWhPaQPC+0st505s4x92xtlRu878LxgNwXAMbdp9QGyepaMZrEwk2989waYFRnhf8VJI38/pwOQXiXIoG5jkT9ND6aK7m0gW9TFbQx1016TwGLPk4oQs10F5epUR2F7aRkMv1Laqa/vs0KQ0bbcAxOBA5Wf1i8PO3/wbRrRPYj72ERfY7S0WsdV1/nkO5EzMiqJFuRIF3qt7As+rvV07J0yi+8B1J7xmugOmupp80CAwEAAQ==' +
      '-----END PUBLIC KEY-----';

    const pubKey = forge.pki.publicKeyFromPem(permPublicSuite);
    let ciphertext = forge.util.encode64( pubKey.encrypt(plaintext));
    
    return ciphertext;
  }
}
