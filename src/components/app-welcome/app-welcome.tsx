import { Component } from '@stencil/core';

@Component({
  tag: 'app-welcome'
})
export class AppWelcome {

  render() {
    return [
      <ion-header>
        <ion-toolbar>
          <ion-title>Welcome!</ion-title>
        </ion-toolbar>
      </ion-header>
    ];
  }
}