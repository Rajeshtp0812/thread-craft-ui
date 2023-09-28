import { Component } from '@angular/core';
import { EMAIL } from '../../../common/validators/customValidators';
import { AuthService } from '../../services/auth.service';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {
  email = '';
  error = '';

  constructor(private readonly authService: AuthService,
    private readonly messageService: MessageService) { }

  modelChanged() {
    this.error = !EMAIL.test(this.email) ? 'Invalid email' : '';
  }

  async submit() {
    if (this.email && !this.error) {
      try {
        await this.authService.forgotPassword(this.email)
        this.messageService.add({ severity: 'success', summary: 'Password has been sent to your email address', detail: ' Please check your inbox, and dont forget to also look in your spam folder, just in case' });
      } catch (err) {
        this.messageService.add({ severity: 'error', summary: 'Unexpected system error, try again', detail: '' });
      }
    }
  }
}
