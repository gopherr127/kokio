import { Component, State } from '@stencil/core';
import { AuthenticationService } from '../../services/auth-service';

@Component({
  tag: 'app-root'
})
export class AppRoot {
  
  public authSvc: AuthenticationService = new AuthenticationService();
  @State() isUserAuthenticated: boolean;

  adminPages = [
    { title: 'Projects',    url: '/projects',     icon: 'albums' },
  ];

  async componentWillLoad() {
    
    this.tryUpdateIsUserAuthenticated();
    
    if (!this.isUserAuthenticated) {

      try {
        await this.authSvc.handleAuthentication();
      } catch {}
      
      this.tryUpdateIsUserAuthenticated();
    }
  }

  async componentWillUpdate() {
    
    this.tryUpdateIsUserAuthenticated();
  }

  async tryUpdateIsUserAuthenticated() {

    this.isUserAuthenticated = await this.authSvc.getIsUserAuthenticated();
  }

  async handleSigninClick() {

    await this.authSvc.initiateAuthentication();
  }

  async handleSignoutClick() {

    await this.authSvc.clearSession();
    document.querySelector('ion-nav').setRoot('app-welcome');
  }

  renderRouteConfig() {
    return(
      <ion-router useHash={false}>
        <ion-route-redirect from='/' to={this.isUserAuthenticated ? '/dashboard' : '/welcome'} ></ion-route-redirect>
        <ion-route url='/welcome' component='app-welcome'></ion-route>
        <ion-route url='/dashboard' component='user-dashboard'></ion-route>
        <ion-route url='/projects' component='projects-list'></ion-route>
        <ion-route url='/projects/:id' component='project-detail'></ion-route>
      </ion-router>
    );
  }

  renderMenuForAuthenticatedUser() {
    return [
      <ion-list>
        <ion-list-header>
          Administration
        </ion-list-header>
        {this.adminPages.map((page) =>
          <ion-menu-toggle autoHide={false}>
            <ion-item href={page.url}>
              <ion-icon slot="start" name={page.icon}></ion-icon>
              <ion-label>
                {page.title}
              </ion-label>
            </ion-item>
          </ion-menu-toggle>
        )}
      </ion-list>,
      <p></p>,      
      <ion-list>
        <ion-list-header>
          Account
        </ion-list-header>
        <ion-menu-toggle autoHide={false}>
          <ion-item button onClick={ () => this.handleSignoutClick() }>
            <ion-icon slot="start" name='exit'></ion-icon>
            <ion-label>Sign Out</ion-label>
          </ion-item>
        </ion-menu-toggle>
      </ion-list>
    ];
  }

  renderMenuContent() {
    return(
      <ion-content>
        {this.isUserAuthenticated
          ? 
            this.renderMenuForAuthenticatedUser()
          : <ion-item button onClick={ () => this.handleSigninClick() }>
              <ion-label>Sign In</ion-label>
            </ion-item>
        }
      </ion-content>
    );
  }

  render() {
    return(
      <ion-app>

        { this.renderRouteConfig() }

        <ion-split-pane>

          <ion-menu>

            <ion-header>
              <ion-toolbar>
                <ion-title>Menu</ion-title>
              </ion-toolbar>
            </ion-header>

            { this.renderMenuContent() }

          </ion-menu>

          <ion-nav main animated={false}></ion-nav>

        </ion-split-pane>

      </ion-app>
    );
  }
}