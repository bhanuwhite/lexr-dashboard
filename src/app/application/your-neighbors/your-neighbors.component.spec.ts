import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourNeighborsComponent } from './your-neighbors.component';

describe('YourNeighborsComponent', () => {
  let component: YourNeighborsComponent;
  let fixture: ComponentFixture<YourNeighborsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourNeighborsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(YourNeighborsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
