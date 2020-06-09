import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TireSizeDialogComponent } from './tire-size-dialog.component';

describe('TireSizeDialogComponent', () => {
  let component: TireSizeDialogComponent;
  let fixture: ComponentFixture<TireSizeDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TireSizeDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TireSizeDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
