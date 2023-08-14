import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorMainComponent } from './vendor-main.component';

describe('VendorMainComponent', () => {
  let component: VendorMainComponent;
  let fixture: ComponentFixture<VendorMainComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VendorMainComponent]
    });
    fixture = TestBed.createComponent(VendorMainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
