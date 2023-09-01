import { NgModule } from '@angular/core';
import { CommonFormComponent } from './components/common-form/common-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { TokenTimerComponent } from './components/token-timer/token-timer.component';
import { InputNumberModule } from 'primeng/inputnumber';

@NgModule({
    declarations: [
        CommonFormComponent,
        TokenTimerComponent
    ],
    imports: [
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        InputTextareaModule,
        InputTextModule,
        InputNumberModule
    ],
    exports: [
        CommonFormComponent
    ],
    providers: [
    ]
})
export class CommonsModule { }
