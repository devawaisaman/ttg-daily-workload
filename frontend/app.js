angular.module('ttgApp', [])
  .service('apiService', function($http) {
    const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:4000';
    
    this.getStatusCounts = function(date) {
      return $http.get(`${API_BASE}/api/status-counts`, {
        params: { date: date }
      });
    };
  })
  .controller('DashboardCtrl', function($scope, apiService) {
    // Initialize date to default
    $scope.date = '2025-10-03';
    $scope.statusCounts = [];
    $scope.loading = false;
    $scope.error = null;

    // Icon mapping for different status types
    $scope.getIconForStatus = function(statusKey) {
      const iconMap = {
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
      return iconMap[statusKey] || 'doc';
    };

    // Fetch status counts from API
    $scope.fetchStatusCounts = function() {
      if (!$scope.date) return;
      
      $scope.loading = true;
      $scope.error = null;
      
      apiService.getStatusCounts($scope.date)
        .then(function(response) {
          $scope.statusCounts = response.data.items || [];
          $scope.loading = false;
        })
        .catch(function(error) {
          console.error('Error fetching status counts:', error);
          $scope.error = 'Failed to load status counts. Please try again.';
          $scope.loading = false;
        });
    };

    // Initial load
    $scope.fetchStatusCounts();
  });
