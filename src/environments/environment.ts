export class ENV {

  public static currentEnvironment: string = "dev";
  //public static currentEnvironment: string = "prod";

  clientUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "http://localhost:3333";
      }
      case "prod": {
        return "https://kokio.com";
      }
      default: {
        return "";
      }
    }
  }

  serverUrl() {
    switch (ENV.currentEnvironment) {
      case "dev": {
        return "http://localhost:10652";
      }
      case "prod": {
        return "https://kokio-server.azurewebsites.net";
      }
      default: {
        return "";
      }
    }
  }
  
  apiBaseUrl() {
    return `${this.serverUrl()}/api`;
  }
  
};