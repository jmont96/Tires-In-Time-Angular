import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireInfoDialogComponent } from './tire-info-dialog.component';

describe('TireInfoDialogComponent', () => {
  let component: TireInfoDialogComponent;
  let fixture: ComponentFixture<TireInfoDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireInfoDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireInfoDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
