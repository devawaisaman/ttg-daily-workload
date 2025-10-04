angular.module('ttgApp', [])
  .service('apiService', function($http) {
    const API_BASE = window.VITE_API_BASE || 'http://localhost:4000';
    
    this.getCounts = function(date) {
      return $http.get(`${API_BASE}/api/status-counts?date=${date}`);
    };
  })
  .controller('DashboardCtrl', function($scope, apiService) {
    const ICON_BY_KEY = {
      'Documents Received': 'file-alt',
      'Received Title': 'star',
      'Send Docs to TTG': 'upload',
      'On Hold- QA': 'clock',
      'TTG sent to county': 'sync-alt',
      'Successfully Sent to DMV': 'university',
      'WS correction requested': 'clipboard-list',
      'WS Correction Complete': 'check-circle',
      'Post Audit': 'file-invoice'
    };

    // Set today's date as default
    const today = new Date();
    const todayString = today.toISOString().split('T')[0];
    $scope.date = todayString;
    $scope.items = [];
    $scope.loading = false;
    $scope.error = null;
    $scope.selectedCard = null;

    $scope.getIcon = function(name) {
      return ICON_BY_KEY[name] || 'doc';
    };

    $scope.selectCard = function(index) {
      $scope.selectedCard = $scope.selectedCard === index ? null : index;
    };

    $scope.formatDate = function(date) {
      if (!date) return null;
      
      if (typeof date === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return date;
      }
      
      const d = new Date(date);
      if (isNaN(d.getTime())) {
        return null;
      }
      
      const year = d.getFullYear();
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const day = String(d.getDate()).padStart(2, '0');
      
      return `${year}-${month}-${day}`;
    };

    $scope.loadCounts = function() {
      if (!$scope.date) return;
      
      const formattedDate = $scope.formatDate($scope.date);
      if (!formattedDate) {
        $scope.error = 'Invalid date format. Please use YYYY-MM-DD format.';
        return;
      }
      
      $scope.loading = true;
      $scope.error = null;
      
      apiService.getCounts(formattedDate)
        .then(function(response) {
          $scope.items = response.data.items || [];
          $scope.loading = false;
          
          // Select first card by default if items exist
          if ($scope.items.length > 0) {
            $scope.selectedCard = 0;
          }
        })
        .catch(function(error) {
          $scope.error = 'Failed to load data: ' + (error.data?.error || error.statusText || 'Unknown error');
          $scope.loading = false;
        });
    };

    $scope.loadCounts();
  });
