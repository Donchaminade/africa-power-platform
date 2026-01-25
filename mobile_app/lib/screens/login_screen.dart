import 'package:flutter/material.dart';
import 'dart:convert';
import 'package:http/http.dart' as http;
import 'package:shared_preferences/shared_preferences.dart'; // For storing user session
import '../config/api_config.dart'; // Import API configuration
import 'home_screen.dart'; // Import Home Screen
import 'dart:ui'; // Import for ImageFilter.blur

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key});

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _passwordController = TextEditingController();
  bool _isLoading = false;
  String? _errorMessage;

  Future<void> _login() async {
    if (_formKey.currentState!.validate()) {
      setState(() {
        _isLoading = true;
        _errorMessage = null;
      });

      try {
        final requestBody = json.encode({
          'email': _emailController.text,
          'password': _passwordController.text,
        });
        debugPrint('Login Request Body: $requestBody'); // Log request body

        final response = await http.post(
          Uri.parse('${ApiConfig.baseUrl}/login'),
          headers: {'Content-Type': 'application/json'},
          body: requestBody,
        );

        debugPrint('Login Response Status Code: ${response.statusCode}'); // Log status code
        debugPrint('Login Response Body: ${response.body}'); // Log response body

        if (response.statusCode == 200) {
          final responseData = json.decode(response.body);
          // Store user data (e.g., name, role) in shared preferences
          SharedPreferences prefs = await SharedPreferences.getInstance();
          await prefs.setString('userName', responseData['name']);
          await prefs.setString('userRole', responseData['role']);
          
          // Navigate to Home Screen using named route
          if (mounted) {
            Navigator.of(context).pushReplacementNamed('/home');
          }
        } else {
          final errorData = json.decode(response.body);
          setState(() {
            _errorMessage = errorData['message'] ?? 'Authentication failed.';
          });
        }
      } catch (e) {
        debugPrint('Login Error: $e'); // Log network error
        setState(() {
          _errorMessage = 'Erreur réseau. Veuillez réessayer.';
        });
      } finally {
        setState(() {
          _isLoading = false;
        });
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.transparent, // Set scaffold background to transparent
      body: Stack(
        children: [
          // Background with gradient
          Container(
            decoration: const BoxDecoration(
              gradient: LinearGradient(
                colors: [Color.fromARGB(255, 33, 150, 243), Color.fromARGB(255, 76, 175, 80)], // Blue to Green
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
            ),
          ),
          Center(
            child: ClipRRect(
              borderRadius: BorderRadius.circular(20.0), // Rounded corners for the glass effect
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0), // Frosted glass effect
                child: Container(
                  width: MediaQuery.of(context).size.width * 0.85, // Adjust width as needed
                  padding: const EdgeInsets.all(30.0),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.2), // Translucent background
                    borderRadius: BorderRadius.circular(20.0),
                    border: Border.all(color: Colors.white.withOpacity(0.3)), // Light border
                  ),
                  child: SingleChildScrollView(
                    child: Form(
                      key: _formKey,
                      child: Column(
                        mainAxisSize: MainAxisSize.min, // Use min to wrap content
                        mainAxisAlignment: MainAxisAlignment.center,
                        children: <Widget>[
                          Image.asset('assets/images/logo.png', height: 100), // App Logo
                          const SizedBox(height: 20),
                          const Text(
                            'Bienvenue !',
                            style: TextStyle(
                              fontSize: 26,
                              fontWeight: FontWeight.bold,
                              color: Colors.white, // Text color for better contrast
                            ),
                          ),
                          const Text(
                            'Connectez-vous pour continuer',
                            style: TextStyle(
                              fontSize: 15,
                              color: Colors.white70, // Text color for better contrast
                            ),
                          ),
                          const SizedBox(height: 30),
                          TextFormField(
                            controller: _emailController,
                            style: const TextStyle(color: Colors.white), // Text color inside input
                            decoration: InputDecoration(
                              labelText: 'Email',
                              labelStyle: TextStyle(color: Colors.white70),
                              prefixIcon: const Icon(Icons.email, color: Colors.white70),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white54),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white54),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white),
                              ),
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.1), // Translucent fill
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Veuillez entrer votre email.';
                              }
                              if (!RegExp(r'^[^@]+@[^@]+\.[^@]+').hasMatch(value)) {
                                return 'Veuillez entrer une adresse email valide.';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 20),
                          TextFormField(
                            controller: _passwordController,
                            obscureText: true,
                            style: const TextStyle(color: Colors.white), // Text color inside input
                            decoration: InputDecoration(
                              labelText: 'Mot de passe',
                              labelStyle: TextStyle(color: Colors.white70),
                              prefixIcon: const Icon(Icons.lock, color: Colors.white70),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white54),
                              ),
                              enabledBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white54),
                              ),
                              focusedBorder: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(10),
                                borderSide: BorderSide(color: Colors.white),
                              ),
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.1), // Translucent fill
                            ),
                            validator: (value) {
                              if (value == null || value.isEmpty) {
                                return 'Veuillez entrer votre mot de passe.';
                              }
                              return null;
                            },
                          ),
                          const SizedBox(height: 30),
                          if (_errorMessage != null)
                            Padding(
                              padding: const EdgeInsets.only(bottom: 20),
                              child: Text(
                                _errorMessage!,
                                style: const TextStyle(color: Colors.redAccent, fontSize: 14), // Adjust error message color
                                textAlign: TextAlign.center,
                              ),
                            ),
                          ElevatedButton(
                            onPressed: _isLoading ? null : _login,
                            style: ElevatedButton.styleFrom(
                              backgroundColor: Colors.white, // Button color
                              foregroundColor: Color.fromARGB(255, 33, 150, 243), // Text color (blue from gradient)
                              minimumSize: const Size(double.infinity, 50), // Full width button
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(10),
                              ),
                              elevation: 5, // Add some elevation
                            ),
                            child: _isLoading
                                ? const CircularProgressIndicator(color: Color.fromARGB(255, 33, 150, 243))
                                : const Text(
                                    'Se connecter',
                                    style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
                                  ),
                          ),
                        ],
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
