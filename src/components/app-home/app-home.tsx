import { Component, State } from '@stencil/core';
import { AuthenticationService } from '../../services/auth-service';

@Component({
  tag: 'app-home',
  styleUrl: 'app-home.scss'
})
export class AppHome {
  
  public authSvc: AuthenticationService = new AuthenticationService();
  @State() isUserAuthenticated: boolean;

  async componentWillLoad() {
    
    this.isUserAuthenticated = await this.authSvc.getIsUserAuthenticated();
    
    if (!this.isUserAuthenticated) {

      try {
        await this.authSvc.handleAuthentication();
      } catch {}
      
      this.isUserAuthenticated = await this.authSvc.getIsUserAuthenticated();

      if (this.isUserAuthenticated) {
        const navCtrl = document.querySelector('ion-nav');
        navCtrl.setRoot('app-home');
      }
    }
  }

  async componentWillUpdate() {
    
    this.isUserAuthenticated = await this.authSvc.getIsUserAuthenticated();
  }

  async handleSigninClick() {

    await this.authSvc.initiateAuthentication();
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar color='primary'>
          <ion-title>Kokio</ion-title>
          <ion-buttons slot="end">
            <ion-button href='/'>
              ...
            </ion-button>
          </ion-buttons>
        </ion-toolbar>
      </ion-header>,

      <ion-content>
        <p>
          Welcome to the Ionic PWA Toolkit.
          You can use this starter to build entire PWAs all with
          web components using Stencil and ionic/core! Check out the readme for everything that comes in this starter out of the box and
          Check out our docs on <a href='https://stenciljs.com'>stenciljs.com</a> to get started.
        </p>

        <ion-button href='/profile/#testingsomething'>
          Profile
        </ion-button>

        <ion-button onClick={ () => this.handleSigninClick() }>
          Sign In
        </ion-button>

        <ion-button style={{ display: this.isUserAuthenticated ? 'block' : 'none' }}
                    onClick={ () => this.authSvc.clearSession() }>
          Sign Out
        </ion-button>

      </ion-content>
    ];
  }
}
