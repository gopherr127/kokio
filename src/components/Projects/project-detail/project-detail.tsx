import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Project } from '../../../interfaces/interfaces';

@Component({
  tag: 'project-detail'
})
export class ProjectDetail {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() id: string;
  @State() subtitle: string;
  @State() project: Project;
  
  async componentWillLoad() {

    await this.loadProject();
  }

  async loadProject() {

    let response = await fetch(
      `${this.apiBaseUrl}/projects/${this.id}`, {
        method: "GET"
    });

    if (response.ok) {

      this.project = await response.json();
      this.subtitle = `Project: ${this.project.name}`
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
      
      document.querySelector('ion-router').push('/projects');
    }
  }

  async handleCancelClick() {

    document.querySelector('ion-router').push('/projects');
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