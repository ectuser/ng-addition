import { Component, PLATFORM_ID, input } from '@angular/core';
import { By } from '@angular/platform-browser';

import { ComponentFixture, TestBed, discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';

import { DeferredLoaderComponent } from './deferred-loader.component';

@Component({
  template: `<deferred-loader [isLoading]="loading()">
    <ng-template #loader>
      <div id="loader"></div>
    </ng-template>
    <ng-template #content>
      <div id="content"></div>
    </ng-template>
    <ng-template #placeholder>
      <div id="placeholder"></div>
    </ng-template>

    <div id="otherContent">Other content</div>
  </deferred-loader>`,
  standalone: true,
  imports: [DeferredLoaderComponent]
})
class TestHostComponent {
  public readonly loading = input.required<boolean>();
}

describe('DeferredLoaderComponent', () => {
  let component: DeferredLoaderComponent;
  let fixture: ComponentFixture<DeferredLoaderComponent>;

  let hostComponent: TestHostComponent;
  let hostFixture: ComponentFixture<TestHostComponent>;

  async function createComponents() {
    await TestBed.compileComponents();

    hostFixture = TestBed.createComponent(TestHostComponent);
    hostComponent = hostFixture.componentInstance;

    fixture = TestBed.createComponent(DeferredLoaderComponent);
    component = fixture.componentInstance;
  }

  function getContent() {
    const content = hostFixture.debugElement.query(By.css('#content'));

    return content;
  }

  function getLoader() {
    const loader = hostFixture.debugElement.query(By.css('#loader'));

    return loader;
  }

  function getPlaceholder() {
    const placeholder = hostFixture.debugElement.query(By.css('#placeholder'));

    return placeholder;
  }

  function getAllElements() {
    const content = getContent();
    const loader = getLoader();
    const placeholder = getPlaceholder();

    return {content, loader, placeholder};
  }

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: PLATFORM_ID, useValue: 'browser' },
      ]
    });
  });

  it('component should be defined', async () => {
    await createComponents();
    expect(component).toBeTruthy();
  });

  describe('should always render ng-content', () => {
    it('should render ng-content when it is a browser', async () => {
      await createComponents();

      let loadedContent = hostFixture.debugElement.query(By.css('#otherContent'));
      expect(loadedContent).toBeTruthy();

      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();

      await hostFixture.whenStable();

      loadedContent = hostFixture.debugElement.query(By.css('#otherContent'));

      expect(loadedContent).toBeTruthy();

      hostFixture.componentRef.setInput('loading', false);
      hostFixture.detectChanges();

      await hostFixture.whenStable();

      loadedContent = hostFixture.debugElement.query(By.css('#otherContent'));

      expect(loadedContent).toBeTruthy();
    });
    it('should render ng-content when it is a server', async () => {
      TestBed.overrideProvider(PLATFORM_ID, {useValue: 'server'});

      await createComponents();

      let loadedContent = hostFixture.debugElement.query(By.css('#otherContent'));
      expect(loadedContent).toBeTruthy();

      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();

      await hostFixture.whenStable();

      loadedContent = hostFixture.debugElement.query(By.css('#otherContent'));

      expect(loadedContent).toBeTruthy();

      hostFixture.componentRef.setInput('loading', false);
      hostFixture.detectChanges();

      await hostFixture.whenStable();

      loadedContent = hostFixture.debugElement.query(By.css('#otherContent'));

      expect(loadedContent).toBeTruthy();
    });
  });

  describe('if browser', () => {
    it('should render placeholder when loading for less than `loadingThreshold`', fakeAsync(async () => {
      await createComponents();

      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();
      
      const {content, loader, placeholder} = getAllElements();

      expect(placeholder).toBeTruthy();
      expect(content).toBeFalsy();
      expect(loader).toBeFalsy();

      discardPeriodicTasks();
    }));

    it('should render loading when loading takes longer than `loadingThreshold`', fakeAsync(async () => {
      await createComponents();

      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();

      tick(1001);
      
      const {content, loader, placeholder} = getAllElements();

      expect(placeholder).toBeFalsy();
      expect(content).toBeFalsy();
      expect(loader).toBeTruthy();

      discardPeriodicTasks();
    }));

    it('should render content when loading took less than `loadingThreshold`', fakeAsync(async () => {
      await createComponents();

      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();

      hostFixture.componentRef.setInput('loading', false);
      hostFixture.detectChanges();

      tick(200);
      
      const {content, loader, placeholder} = getAllElements();

      expect(placeholder).toBeFalsy();
      expect(content).toBeTruthy();
      expect(loader).toBeFalsy();

      discardPeriodicTasks();
    }));

    it('should render loading when loading is over but it passed less than `minLoadingTime`', fakeAsync(async () => {
      await createComponents();

      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();

      tick(1001);

      hostFixture.componentRef.setInput('loading', false);
      hostFixture.detectChanges();
      
      const {content, loader, placeholder} = getAllElements();

      expect(placeholder).toBeFalsy();
      expect(content).toBeFalsy();
      expect(loader).toBeTruthy();

      discardPeriodicTasks();
    }));

    it('should render content when loading is over and it is passed more than `minLoadingTime`', fakeAsync(async () => {
      await createComponents();

      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();

      tick(1501);

      hostFixture.componentRef.setInput('loading', false);
      hostFixture.detectChanges();
      
      const {content, loader, placeholder} = getAllElements();

      expect(placeholder).toBeFalsy();
      expect(content).toBeTruthy();
      expect(loader).toBeFalsy();

      discardPeriodicTasks();
    }));
  });

  describe('if SSR', () => {

    beforeEach(async () => {
      TestBed.overrideProvider(PLATFORM_ID, {useValue: 'server'});

      await createComponents();
    });

    it('should render as loading states', async () => {
      hostFixture.componentRef.setInput('loading', true);
      hostFixture.detectChanges();

      await hostFixture.whenStable();

      let loader = getLoader();
      let loadedContent = getContent();

      expect(loader).toBeTruthy();
      expect(loadedContent).toBeFalsy();
      
      hostFixture.componentRef.setInput('loading', false);
      hostFixture.detectChanges();

      await hostFixture.whenStable();

      loader = getLoader();
      loadedContent = getContent();

      expect(loader).toBeFalsy();
      expect(loadedContent).toBeTruthy();
    });
  });
});