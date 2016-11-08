'use strict';

describe('Secrets E2E Tests:', function () {
  describe('Test Secrets page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/secrets');
      expect(element.all(by.repeater('secret in secrets')).count()).toEqual(0);
    });
  });
});
