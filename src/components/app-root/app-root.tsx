import { Component, Prop, State } from '@stencil/core';
import { AuthenticationService } from '../../services/auth-service';

@Component({
  tag: 'app-root'
})
export class AppRoot {
  
  public authSvc: AuthenticationService = new AuthenticationService();
  @Prop({connect: 'ion-nav'}) nav;
  @State() isUserAuthenticated: boolean;

  async componentWillLoad() {
    
    this.tryUpdateIsUserAuthenticated();
    
    if (!this.isUserAuthenticated) {

      try {
        await this.authSvc.handleAuthentication();
      } catch {}
      
      this.tryUpdateIsUserAuthenticated();
    }
  }

  async componentWillUpdate() {
    
    this.tryUpdateIsUserAuthenticated();
  }

  async tryUpdateIsUserAuthenticated() {

    this.isUserAuthenticated = await this.authSvc.getIsUserAuthenticated();
  }

  async handleSigninClick() {

    await this.authSvc.initiateAuthentication();
  }

  async handleSignoutClick() {

    await this.authSvc.clearSession();
    const navCtrl: HTMLIonNavElement = await (this.nav as any).componentOnReady();
    navCtrl.setRoot('app-welcome');
  }

  render() {
    return(
      <ion-app>

        <ion-router useHash={false}>
          <ion-route-redirect from='/' to={this.isUserAuthenticated ? '/dashboard' : '/welcome'} ></ion-route-redirect>
          <ion-route url='/welcome' component='app-welcome'></ion-route>
          <ion-route url='/dashboard' component='user-dashboard'></ion-route>
        </ion-router>

        <ion-split-pane>

          <ion-menu>

            <ion-header>
              <ion-toolbar>
                <ion-title>Menu</ion-title>
              </ion-toolbar>
            </ion-header>

            <ion-content forceOverscroll={false}>
              <ion-item button style={{ display : this.isUserAuthenticated ? 'none' : 'block' }}
                        onClick={ () => this.handleSigninClick() }>
                <ion-label>Sign In</ion-label>
              </ion-item>
              <ion-item button style={{ display : this.isUserAuthenticated ? 'block' : 'none' }}
                        onClick={ () => this.handleSignoutClick() }>
                <ion-label>Sign Out</ion-label>
              </ion-item>
            </ion-content>

          </ion-menu>

          <ion-nav main animated={false}></ion-nav>

        </ion-split-pane>

      </ion-app>
    );
  }
}