import { NgModule } from '@angular/core';
import { GenericTableCtrlComponent } from './components/generic-table-ctrl/generic-table-ctrl.component';
import { CommonFormComponent } from './components/common-form/common-form.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';

@NgModule({
    declarations: [
        GenericTableCtrlComponent,
        CommonFormComponent
    ],
    imports: [
        FormsModule,
        DropdownModule,
        InputTextareaModule,
        InputTextModule
    ],
    exports: [
        GenericTableCtrlComponent,
        CommonFormComponent
    ]
})
export class CommonsModule { }
