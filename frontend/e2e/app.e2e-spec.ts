import { MockpiPage } from './app.po';

describe('mockpi App', () => {
  let page: MockpiPage;

  beforeEach(() => {
    page = new MockpiPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
