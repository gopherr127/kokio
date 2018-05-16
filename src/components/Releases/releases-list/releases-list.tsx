import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Release } from '../../../interfaces/interfaces';

@Component({
  tag: 'releases-list'
})
export class ReleasesList {

  apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  releasesList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: HTMLIonPopoverControllerElement;
  @Prop({ connect: 'ion-toast-controller' }) toastCtrl: HTMLIonToastControllerElement;
  @State() queryText = '';
  @State() releases: Array<Release> = [];

  
  async componentWillLoad() {
    
    await this.loadReleases();
  }

  componentDidLoad() {

    this.releasesList = this.el.querySelector('#releasesList');
  }

  @Listen('body:ionModalDidDismiss')
  @Listen('releaseUpdated')
  async loadReleases() {
    
    let response = await fetch(
      `${this.apiBaseUrl}/releases`, { 
        method: "GET"
    });

    if (response.ok) {

      this.releases = await response.json();
    }
  }

  async handleCreateClick() {

    const modal = await this.modalCtrl.create({
      component: 'release-create'
    });
    
    await modal.present();
  }

  async handleDeleteClick(release: Release) {

    let response = await fetch(
      this.apiBaseUrl + "/releases/" + release.id, {
        method: "DELETE"
    });

    if (response.ok) {
      
      await this.loadReleases();
      this.releasesList.closeSlidingItems();
    }
    else {

      if (response.status === 401) {

        this.displayErrorToast("You do not have permission to perform this action.");
      }
    }
  }

  async displayErrorToast(message: string) {

    const toast = await this.toastCtrl.create({
      message: message,
      position: 'top',
      showCloseButton: true
    });

    toast.present();
  }

  @Listen('ionFocus')
  async handleElementFocused(event: any) {

    if (event.target.id === "optionsMenu") {

      var popover = await this.popoverCtrl.create({
        component: 'releases-list-options-menu',
        ev: event
      });
      await popover.present();
    }
  }

  render() {
    return[
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
          </ion-buttons>
          <ion-title>Kokio</ion-title>
        </ion-toolbar>

        <ion-toolbar color="secondary">
          <ion-title>Releases</ion-title>
          <ion-buttons slot="end">
            <ion-button id="createButton" fill="solid" color="primary" 
                        onClick={ () => this.handleCreateClick() }>
              Create
            </ion-button>
            <ion-button id="optionsMenu">
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar color="tertiary">
          <ion-searchbar value={this.queryText} placeholder="Search">
          </ion-searchbar>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-list id="releasesList">
          {this.releases.map(release => 
            <ion-item-sliding>
              <ion-item href={`/releases/${release.id}`}>
                <h2>{ release.name }</h2>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(release) }>
                  Delete
                </ion-item-option>
              </ion-item-options>
            </ion-item-sliding>
          )}
          <ion-item disabled></ion-item>
          <ion-item disabled></ion-item>
        </ion-list>

        <ion-fab id="fabSection" horizontal="end" vertical="bottom" slot="fixed">
          <ion-fab-button onClick={ () => this.handleCreateClick() }>Create</ion-fab-button>
        </ion-fab>

      </ion-content>
    ];
  }
}