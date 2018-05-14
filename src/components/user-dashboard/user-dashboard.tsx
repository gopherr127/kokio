import { Component } from '@stencil/core';

@Component({
  tag: 'user-dashboard'
})
export class UserDashboard {

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