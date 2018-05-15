import { Component, Element, Listen, Prop, State } from '@stencil/core';
import { ENV } from '../../../environments/environment';
import { Project } from '../../../interfaces/interfaces';

@Component({
  tag: 'projects-list'
})
export class ProjectsList {

  apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  projectsList: HTMLIonListElement;
  @Prop({ connect: 'ion-modal-controller' }) modalCtrl: HTMLIonModalControllerElement;
  @Prop({ connect: 'ion-popover-controller' }) popoverCtrl: HTMLIonPopoverControllerElement;
  @State() queryText = '';
  @State() projects: Array<Project> = [];

  async componentWillLoad() {
    
    await this.loadProjects();
  }

  componentDidLoad() {

    this.projectsList = this.el.querySelector('#projectsList');
  }

  @Listen('body:ionModalDidDismiss')
  async loadProjects() {
    
    let response = await fetch(
      `${this.apiBaseUrl}/projects`, { 
        method: "GET"
    });

    if (response.ok) {

      this.projects = await response.json();
    }
  }

  async handleCreateClick() {

    const modal = await this.modalCtrl.create({
      component: 'project-create'
    });
    
    await modal.present();
  }

  async handleDeleteClick(project: Project) {

    let response = await fetch(
      this.apiBaseUrl + "/projects/" + project.id, {
        method: "DELETE"
    });

    if (response.ok) {
      
      await this.loadProjects();
      this.projectsList.closeSlidingItems();
    }
  }

  @Listen('ionFocus')
  async handleElementFocused(event: any) {

    if (event.target.id === "optionsMenu") {

      var popover = await this.popoverCtrl.create({
        component: 'projects-list-options-menu',
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
          <ion-title>Projects</ion-title>
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

        <ion-list id="projectsList">
          {this.projects.map(project => 
            <ion-item-sliding>
              <ion-item href={`/projects/${project.id}`}>
                <h2>{ project.name }</h2>
              </ion-item>
              <ion-item-options>
                <ion-item-option color="danger" onClick={ () =>
                    this.handleDeleteClick(project) }>
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