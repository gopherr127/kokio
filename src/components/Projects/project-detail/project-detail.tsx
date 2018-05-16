import { Component, Element, Event, EventEmitter, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Project, Release } from '../../../interfaces/interfaces';

@Component({
  tag: 'project-detail'
})
export class ProjectDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  releasesList: HTMLIonListElement;
  @Event() projectUpdated: EventEmitter;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop() id: string;
  @State() subtitle: string;
  @State() project: Project;
  @State() releases: Array<Release> = [];
  
  async componentWillLoad() {

    await this.loadProject();
  }

  componentDidLoad() {

    this.releasesList = this.el.querySelector('#releasesList');
  }

  @Listen('body:ionModalDidDismiss')
  async loadProject() {

    let response = await fetch(
      `${this.apiBaseUrl}/projects/${this.id}`, {
        method: 'GET'
    });

    if (response.ok) {

      this.project = await response.json();
      this.subtitle = `Project: ${this.project.name}`;
      await this.loadProjectReleases();
    }
  }

  async loadProjectReleases() {

    let response = await fetch(
      `${this.apiBaseUrl}/releases/search?projectId=${this.id}`, {
        method: 'GET'
    });

    if (response.ok) {

      this.releases = await response.json();
    }
  }

  async handleSaveClick() {

    let response = await fetch(
      `${this.apiBaseUrl}/projects/${this.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(this.project)
    });

    if (response.ok) {
      
      this.projectUpdated.emit();
      document.querySelector('ion-router').push('/projects');
    }
  }

  async handleCancelClick() {

    document.querySelector('ion-router').push('/projects');
  }

  async handleAddReleaseClick() {

    const modal = await this.modalCtrl.create({
      component: 'release-create'
    });
    
    await modal.present();
  }

  async handleDeleteReleaseClick(release: Release) {

    release;
  }

  @Listen('ionChange')
  handleFieldChanged(event: any) {

    if (event.target.id === "projectName") {

      this.project.name = event.detail.value;
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
            <ion-input id="projectName" required debounce={ 200 } value={ this.project.name }></ion-input>
          </ion-item>
          
          <ion-card>
            <ion-card-header no-padding>
              <ion-item>
                <ion-label>Associated Releases</ion-label>
                <ion-button slot="end" onClick={ () => 
                  this.handleAddReleaseClick() }>Add
                </ion-button>
              </ion-item>
            </ion-card-header>
            <ion-card-content>
              <ion-list id="releasesList">
                {this.releases.map(release => 
                  <ion-item-sliding>
                    <ion-item href={`/releases/${release.id}`}>
                      <h2>{ release.name }</h2>
                    </ion-item>
                    <ion-item-options>
                      <ion-item-option color="danger" onClick={ () =>
                          this.handleDeleteReleaseClick(release) }>
                        Delete
                      </ion-item-option>
                    </ion-item-options>
                  </ion-item-sliding>
                )}
              </ion-list>
            </ion-card-content>
          </ion-card>

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