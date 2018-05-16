import { Component, Element, Prop, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Project } from '../../../interfaces/interfaces';

@Component({
  tag: 'release-create'
})
export class ReleaseCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @Prop() projectId: string;
  @State() name: string;
  @State() selectedProjectId: string;
  projects: Array<Project> = [];
  
  async componentWillLoad() {

    await this.loadProjects();
  }

  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async loadProjects() {

    let response = await fetch(
      `${this.apiBaseUrl}/projects`, { 
        method: "GET"
    });

    if (response.ok) {

      this.projects = await response.json();
    }
  }

  async handleSaveClick() {

    let response = await fetch(
      `${this.apiBaseUrl}/releases`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.name,
          projectId: this.selectedProjectId
        })
    });

    if (response.ok) {
      
      this.dismiss();
    }
  }

  async handleCancelClick() {

    this.dismiss();
  }

  @Listen('ionChange')
  handleItemTypeChanged(event: any) {

    if (event.target.id === "releaseName") {

      this.name = event.detail.value;
    }
    else if (event.target.id === "projectSelect") {

      this.selectedProjectId = event.detail.value;
    }
  }

  render() {
    return [
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Release</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="releaseName" debounce={ 200 } value={ this.name }></ion-input>
        </ion-item>
        <ion-item>
          <ion-label position='fixed'>Project</ion-label>
          <ion-select id="projectSelect" slot="end" value={ this.selectedProjectId }>
              { this.projects.map(project => 
                <ion-select-option value={ project.id }>
                  { project.name }
                </ion-select-option>)}
            </ion-select>
        </ion-item>

      </ion-content>,

      <ion-footer>
        <ion-buttons slot="end">
          <ion-button color="primary" fill="solid" 
                      onClick={ () => this.handleSaveClick() }>Save</ion-button>
          <ion-button color="primary" 
                      onClick={ () => this.handleCancelClick()}>Cancel</ion-button>
        </ion-buttons>
      </ion-footer>
    ];
  }
}