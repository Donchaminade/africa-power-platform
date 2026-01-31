class ApiConfig {
  static const bool isDevelopment = true; // Set to false for production build

  // Local development settings (update these for your local environment)
  static const String localIpAddress = '10.73.101.205'; // Your computer's local IP address
  static const String apachePort = '80'; // Your XAMPP Apache port (default is 80)

  // Production settings (update this with your actual production domain)
  static const String productionBasePath = 'https://app.africapowerplatform.com'; 

  // Base paths for API and application
  static const String _localBasePath = 'http://$localIpAddress${apachePort != '80' ? ':$apachePort' : ''}/africa-power-platform';

  static const String baseUrl = isDevelopment 
      ? '$_localBasePath/api'
      : '$productionBasePath/api';

  static const String uploadsUrl = isDevelopment
      ? '$_localBasePath/public'
      : '$productionBasePath/public';

  // Specific API endpoints
  static const String loginEndpoint = '/auth.php'; // Example
}
 