import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AnnouncementRequestsComponent } from './announcement-requests.component';

describe('AnnouncementRequestsComponent', () => {
  let component: AnnouncementRequestsComponent;
  let fixture: ComponentFixture<AnnouncementRequestsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnnouncementRequestsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnnouncementRequestsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
