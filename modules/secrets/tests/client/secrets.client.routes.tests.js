(function () {
  'use strict';

  describe('Secrets Route Tests', function () {
    // Initialize global variables
    var $scope,
      SecretsService;

    // We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _SecretsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      SecretsService = _SecretsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('secrets');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/secrets');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          SecretsController,
          mockSecret;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('secrets.view');
          $templateCache.put('modules/secrets/client/views/view-secret.client.view.html', '');

          // create mock Secret
          mockSecret = new SecretsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Secret Name'
          });

          // Initialize Controller
          SecretsController = $controller('SecretsController as vm', {
            $scope: $scope,
            secretResolve: mockSecret
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:secretId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.secretResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            secretId: 1
          })).toEqual('/secrets/1');
        }));

        it('should attach an Secret to the controller scope', function () {
          expect($scope.vm.secret._id).toBe(mockSecret._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/secrets/client/views/view-secret.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          SecretsController,
          mockSecret;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('secrets.create');
          $templateCache.put('modules/secrets/client/views/form-secret.client.view.html', '');

          // create mock Secret
          mockSecret = new SecretsService();

          // Initialize Controller
          SecretsController = $controller('SecretsController as vm', {
            $scope: $scope,
            secretResolve: mockSecret
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.secretResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/secrets/create');
        }));

        it('should attach an Secret to the controller scope', function () {
          expect($scope.vm.secret._id).toBe(mockSecret._id);
          expect($scope.vm.secret._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/secrets/client/views/form-secret.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          SecretsController,
          mockSecret;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('secrets.edit');
          $templateCache.put('modules/secrets/client/views/form-secret.client.view.html', '');

          // create mock Secret
          mockSecret = new SecretsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Secret Name'
          });

          // Initialize Controller
          SecretsController = $controller('SecretsController as vm', {
            $scope: $scope,
            secretResolve: mockSecret
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:secretId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.secretResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            secretId: 1
          })).toEqual('/secrets/1/edit');
        }));

        it('should attach an Secret to the controller scope', function () {
          expect($scope.vm.secret._id).toBe(mockSecret._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/secrets/client/views/form-secret.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
}());
