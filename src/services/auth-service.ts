import { ENV } from '../environments/environment';
declare const auth0: any;

export class AuthenticationService {

  private readonly clientUrl: string;
  private readonly authClient: any;

  constructor() {

    this.clientUrl = new ENV().clientUrl();

    this.authClient = new auth0.WebAuth({
      domain: 'atlasrfid.auth0.com',
      clientID: 'hf15I23vrah42cfDWsrHC4UGo1j6thpp',
      redirectUri: `${this.clientUrl}/`,
      audience: 'https://atlasrfid.auth0.com/userinfo',
      responseType: 'token id_token',
      scope: 'openid',
      leeway: 60
    });
  }

  public initiateAuthentication(): Promise<void> {

    return new Promise<void>(resolve => {
       this.authClient.authorize();
       resolve();
    });
  }

  public handleAuthentication(): Promise<any> {

    return new Promise((resolve, reject) => {

      if (window.location && window.location.hash) {

        let hashSplit = window.location.hash.split('&');

        try {

          localStorage.setItem('access_token', hashSplit[0].split('=')[1]);
          let expiresIn = parseInt(hashSplit[1].split('=')[1]);
          localStorage.setItem('expires_at', JSON.stringify((expiresIn * 1000) + new Date().getTime()));
          localStorage.setItem('id_token', hashSplit[0].split('=')[4]);
          resolve("Authentication successful.");
        }
        catch {
          reject("An error occurred during parsing.");
        }
      }
      else {
        reject("Nothing to parse.");
      }
    });
  }

  public getIsUserAuthenticated(): Promise<boolean> {

    return new Promise<boolean>(resolve => {

      var accessToken = localStorage.getItem('access_token');
      var expiryNote = localStorage.getItem('expires_at');
      if (!accessToken || !expiryNote) {
        resolve(false);
      }
      // Check whether the current time is past the
      // access token's expiry time
      const expiresAt = JSON.parse(expiryNote);
      resolve(new Date().getTime() < expiresAt);
    });
  }

  public clearSession(): Promise<void> {

    return new Promise<void>(resolve => {

      localStorage.removeItem('access_token');
      localStorage.removeItem('id_token');
      localStorage.removeItem('expires_at');
      resolve();
    });
  }
}