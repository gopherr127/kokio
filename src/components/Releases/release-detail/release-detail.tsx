import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Release } from '../../../interfaces/interfaces';

@Component({
  tag: 'release-detail'
})
export class ReleaseDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  releasesList: HTMLIonListElement;
  @Event() releaseUpdated: EventEmitter;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() id: string;
  @State() subtitle: string;
  @State() release: Release;
  
  async componentWillLoad() {

    await this.loadRelease();
  }

  componentDidLoad() {

    this.releasesList = this.el.querySelector('#releasesList');
  }

  @Listen('body:ionModalDidDismiss')
  async loadRelease() {

    let response = await fetch(
      `${this.apiBaseUrl}/releases/${this.id}`, {
        method: 'GET'
    });

    if (response.ok) {

      this.release = await response.json();
      this.subtitle = `Release: ${this.release.name}`;
    }
  }

  async handleSaveClick() {

    let response = await fetch(
      `${this.apiBaseUrl}/releases/${this.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.release)
    });

    if (response.ok) {
      
      this.releaseUpdated.emit();
      document.querySelector('ion-router').push('/releases');
    }
  }

  async handleCancelClick() {

    document.querySelector('ion-router').push('/releases');
  }

  @Listen('ionChange')
  handleFieldChanged(event: any) {

    if (event.target.id === "releaseName") {

      this.release.name = event.detail.value;
    }
  }

  render() {
    return[
      <ion-header>

        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-menu-button></ion-menu-button>
            <ion-back-button></ion-back-button>
          </ion-buttons>
          <ion-title>Kokio</ion-title>
        </ion-toolbar>

        <ion-toolbar color="secondary">
          <ion-title>{ this.subtitle }</ion-title>
          <ion-buttons slot="end">
            <ion-button id="optionsMenu">
              <ion-icon slot="icon-only" name="more"></ion-icon>
            </ion-button>
          </ion-buttons>
        </ion-toolbar>

        <ion-toolbar id="headerSection" color="tertiary">
            <ion-button slot="start" color="primary" fill="solid" 
                        onClick={ () => this.handleSaveClick() }>Save</ion-button>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
          <ion-item>
            <ion-label position='fixed'>Name</ion-label>
            <ion-input id="releaseName" required debounce={ 200 } value={ this.release.name }></ion-input>
          </ion-item>
          <ion-item>
          <ion-label position='fixed'>Project</ion-label>
          <ion-input id="projectName" disabled value={ this.release.project.name }></ion-input>
        </ion-item>
          
      </ion-content>,

      <ion-footer id="footerSection">
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" 
                      onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" 
                      onClick={ () => this.handleCancelClick() }>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}