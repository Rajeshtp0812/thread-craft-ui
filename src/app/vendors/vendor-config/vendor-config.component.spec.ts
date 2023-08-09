import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorConfigComponent } from './vendor-config.component';

describe('VendorConfigComponent', () => {
  let component: VendorConfigComponent;
  let fixture: ComponentFixture<VendorConfigComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorConfigComponent]
    });
    fixture = TestBed.createComponent(VendorConfigComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
