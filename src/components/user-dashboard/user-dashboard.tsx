import { Component, Prop } from '@stencil/core';
import { AuthService } from '../../services/auth-service';

@Component({
  tag: 'user-dashboard'
})
export class UserDashboard {
  
  public authSvc: AuthService = new AuthService();
  @Prop({connect: 'ion-nav'}) nav;

  async componentWillLoad() {

    if (await !this.authSvc.getIsUserAuthenticated()) {
      const navCtrl: HTMLIonNavElement = await (this.nav as any).componentOnReady();
      navCtrl.setRoot('app-welcome');
    }
  }

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>
    ];
  }
}