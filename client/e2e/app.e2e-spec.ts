import { Angular2FileuploadDemoPage } from './app.po';

describe('angular2-fileupload-demo App', () => {
  let page: Angular2FileuploadDemoPage;

  beforeEach(() => {
    page = new Angular2FileuploadDemoPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
