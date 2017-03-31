import {browser, by, element} from 'protractor';

export class MockpiPage {
  navigateTo() {
    return browser.get('/');
  }

  getParagraphText() {
    return element(by.css('mpi-root h1')).getText();
  }
}
