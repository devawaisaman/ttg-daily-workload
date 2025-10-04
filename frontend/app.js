angular.module('ttgApp', [])
  .service('apiService', function($http) {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
    
    this.getCounts = function(date) {
      return $http.get(`${API_BASE}/api/status-counts?date=${date}`);
    };
  })
  .controller('DashboardCtrl', function($scope, apiService) {
    // Icon mapping constant
    const ICON_BY_KEY = {
      'documents_received': 'doc',
      'received_title': 'star',
      'send_docs_to_ttg': 'upload',
      'on_hold_qa': 'clock',
      'ttg_sent_to_county': 'refresh',
      'successfully_sent_to_dmv': 'bank',
      'ws_correction_requested': 'clipboard-check',
      'ws_correction_complete': 'checklist',
      'post_audit': 'doc'
    };

    // Initialize date to default
    $scope.date = '2025-10-03';
    $scope.items = [];
    $scope.loading = false;
    $scope.error = null;

    // Get icon for status key
    $scope.getIcon = function(key) {
      return ICON_BY_KEY[key] || 'doc';
    };

    // Load counts from API
    $scope.loadCounts = function() {
      if (!$scope.date) return;
      
      $scope.loading = true;
      $scope.error = null;
      
      apiService.getCounts($scope.date)
        .then(function(response) {
          $scope.items = response.data.items || [];
          $scope.loading = false;
        })
        .catch(function(error) {
          console.error('Error fetching counts:', error);
          $scope.error = 'Failed to load data';
          $scope.loading = false;
        });
    };

    // Initial load
    $scope.loadCounts();
  });
