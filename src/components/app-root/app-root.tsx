import { Component } from '@stencil/core';

@Component({
  tag: 'app-root'
})
export class AppRoot {

  render() {
    return(
      <ion-app>
        <ion-router useHash={false}>
          <ion-route url='/' component='app-home'></ion-route>
          <ion-route url='/signin' component='app-signin'></ion-route>
          <ion-route url='/profile' component='app-profile'></ion-route>
        </ion-router>
        <ion-nav></ion-nav>
      </ion-app>
    );
  }
}