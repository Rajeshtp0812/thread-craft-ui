import { Component } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { TokenStorageService } from '../../../auth/services/token-storage.service';
import { AuthService } from '../../../auth/services/auth.service';

@Component({
  selector: 'app-token-timer',
  templateUrl: './token-timer.component.html',
  styleUrls: ['./token-timer.component.scss']
})
export class TokenTimerComponent {
  private countdownSubscription: Subscription;
  timeRemaining: number = 0; // in seconds

  constructor(private tokenStorageService: TokenStorageService,
    private authService: AuthService) { }

  ngOnInit() {
    this.startCountdown();
  }

  startCountdown() {
    const expiryTimestamp = this.tokenStorageService.getTokenExpirationTime(); // Get token expiry time
    this.countdownSubscription = timer(0, 1000).subscribe(() => {
      const currentTime = Math.floor(Date.now() / 1000);
      this.timeRemaining = expiryTimestamp - currentTime;

      if (this.timeRemaining <= 0) {
        // Token expired, handle accordingly
        this.countdownSubscription.unsubscribe();
      }
    });
  }

  extendSession() {
    // Call a service method to extend the session using the refresh token
    // this.authService.refreshToken.subscribe(
    //   (response) => {
    //     // Update the access token and reset the countdown timer
    //     this.tokenStorageService.updateTokens(response);
    //     this.startCountdown();
    //   },
    //   (error) => {
    //     console.error('Error extending session', error);
    //   }
    // );
  }

  logout() {
    // this.tokenStorageService.logout();
    this.countdownSubscription.unsubscribe();
  }

  ngOnDestroy() {
    this.countdownSubscription.unsubscribe();
  }
}
