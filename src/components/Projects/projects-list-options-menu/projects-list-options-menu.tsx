import { Component, Element } from '@stencil/core';

@Component({
  tag: 'projects-list-options-menu'
})
export class ProjectsListOptionsMenu {

  @Element() el: any;
  
  dismiss(data?: any) {
    
    (this.el.closest('ion-popover') as any).dismiss(data);
  }

  refreshItem() {

    this.dismiss();
    document.querySelector('ion-nav').setRoot('projects-list');
  }

  render() {
    return[
      <ion-item onClick={ () => this.refreshItem() }>
        <ion-label>Refresh</ion-label>
      </ion-item>
    ];
  }
}