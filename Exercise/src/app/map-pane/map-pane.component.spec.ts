import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapPaneComponent } from './map-pane.component';

describe('MapPaneComponent', () => {
  let component: MapPaneComponent;
  let fixture: ComponentFixture<MapPaneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapPaneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapPaneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
