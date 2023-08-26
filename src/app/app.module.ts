import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HashLocationStrategy, LocationStrategy } from '@angular/common';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AppLayoutModule } from './layout/app.layout.module';
import { CustomerService } from './common/service/customer.service';
import { EventService } from './common/service/event.service';
import { IconService } from './common/service/icon.service';
import { NodeService } from './common/service/node.service';
import { PhotoService } from './common/service/photo.service';
import { TokenStorageService } from './auth/services/token-storage.service';
import { USER_PREFERENCES } from './common/constants';
import { CommonUtilsService, USER_PREFERENCE } from './common/service/common-utils.service';
import { LayoutService } from './layout/service/app.layout.service';
import { MessagesModule } from 'primeng/messages';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth.interceptor';

export function initApp(
    layoutService: LayoutService,
    commonUtilService: CommonUtilsService
) {
    return () => {
        let userPreferences: USER_PREFERENCE = JSON.parse(localStorage.getItem(USER_PREFERENCES));
        if (userPreferences) {
            layoutService.config.scale = userPreferences.scale;
            layoutService.config.menuMode = userPreferences.drawerMode
            commonUtilService.changeTheme(userPreferences.theme, userPreferences.colorScheme);
        }

    };
}

@NgModule({
    declarations: [
        AppComponent,
    ],
    imports: [
        AppRoutingModule,
        AppLayoutModule,
        MessagesModule,
        ToastModule
    ],
    providers: [
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true
        },
        { provide: LocationStrategy, useClass: HashLocationStrategy },
        { provide: APP_INITIALIZER, useFactory: initApp, multi: true, deps: [LayoutService, CommonUtilsService] },
        CustomerService, EventService, IconService, NodeService, PhotoService, TokenStorageService, MessageService
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
