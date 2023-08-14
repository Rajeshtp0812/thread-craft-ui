import { Injectable } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';
import { USER_PREFERENCES } from '../constants';

export interface USER_PREFERENCE {
  scale?: number,
  drawerMode?: string,
  theme?: string,
  colorScheme?: string
}

@Injectable({
  providedIn: 'root'
})
export class CommonUtilsService {

  constructor(public layoutService: LayoutService) { }

  changeTheme(theme: string, colorScheme: string) {
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const newHref = themeLink.getAttribute('href')!.replace(this.layoutService.config.theme, theme);
    this.layoutService.config.colorScheme
    this.replaceThemeLink(newHref, () => {
      this.layoutService.config.theme = theme;
      this.layoutService.config.colorScheme = colorScheme;
      this.layoutService.onConfigUpdate();
      this.saveUserPreference();
    });
  }

  replaceThemeLink(href: string, onComplete: Function) {
    const id = 'theme-css';
    const themeLink = <HTMLLinkElement>document.getElementById('theme-css');
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);

    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');

    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);

    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }

  saveUserPreference() {
    let userPreference: USER_PREFERENCE = {
      scale: this.layoutService.config.scale,
      drawerMode: this.layoutService.config.menuMode,
      theme: this.layoutService.config.theme,
      colorScheme: this.layoutService.config.colorScheme
    };
    localStorage.setItem(USER_PREFERENCES, JSON.stringify(userPreference));
  }

  applyUserPreference() {
    let userPreferences: USER_PREFERENCE = JSON.parse(localStorage.getItem(USER_PREFERENCES));
    this.layoutService.config.scale = userPreferences.scale;
    this.layoutService.config.menuMode = userPreferences.drawerMode
    this.changeTheme(userPreferences.theme, userPreferences.colorScheme);
  }
}
