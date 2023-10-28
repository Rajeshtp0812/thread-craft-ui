import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';
import { Observable, Subscription, fromEvent } from 'rxjs';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit, OnDestroy {

    onlineEvent: Observable<Event>;
    offlineEvent: Observable<Event>;
    subscriptions: Subscription[] = [];

    connectionStatusMessage: string;
    connectionStatus: string;
    constructor(private primengConfig: PrimeNGConfig,
        private messageService: MessageService) { }

    ngOnInit() {
        this.primengConfig.ripple = true;

        this.onlineEvent = fromEvent(window, 'online');
        this.offlineEvent = fromEvent(window, 'offline');

        this.subscriptions.push(this.onlineEvent.subscribe(e => {
            this.messageService.add({ severity: 'success', summary: 'Back to online', icon: 'pi-wifi' });
        }));

        this.subscriptions.push(this.offlineEvent.subscribe(e => {
            this.connectionStatusMessage = 'Connection lost! You are not connected to internet';
            this.messageService.add({ severity: 'info', summary: 'Offline', detail: 'Connection lost! You are not connected to internet', icon: 'pi-wifi' });
        }));
    }

    ngOnDestroy(): void {
        /**
        * Unsubscribe all subscriptions to avoid memory leak
        */
        this.subscriptions.forEach(subscription => subscription.unsubscribe());
    }
}
