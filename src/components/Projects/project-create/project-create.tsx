import { Component, Element, State, Listen } from '@stencil/core';
import { ENV } from '../../../environments/environment';

@Component({
  tag: 'project-create'
})
export class ProjectCreate {

  public apiBaseUrl: string = new ENV().apiBaseUrl();
  @Element() el: any;
  @State() name: string;
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-modal') as any).dismiss(data);
  }

  async handleSaveClick() {

    let response = await fetch(
      `${this.apiBaseUrl}/projects`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: this.name
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

    if (event.target.id === "projectName") {

      this.name = event.detail.value;
    }
  }

  render() {
    return[
      <ion-header> 

        <ion-toolbar color="secondary">
          <ion-title>Create Project</ion-title>
        </ion-toolbar>

      </ion-header>,

      <ion-content>

        <ion-item></ion-item>
        <ion-item>
          <ion-label position='fixed'>Name</ion-label>
          <ion-input id="projectName" debounce={ 200 } value={ this.name }></ion-input>
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