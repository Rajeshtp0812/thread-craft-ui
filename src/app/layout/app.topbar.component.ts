import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from "./service/app.layout.service";
import { ContextMenu } from 'primeng/contextmenu';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent {

    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    @ViewChild('cm') contextMenu: ContextMenu;

    contextMenuItems = [{ label: 'Profile' }, { label: 'Logout' }];

    constructor(public layoutService: LayoutService) { }

    showContextMenu(event: MouseEvent) {
        event.preventDefault();
        this.contextMenu.show(event);
    }


}
