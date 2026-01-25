import 'package:flutter/material.dart';
import 'package:mobile_app/screens/login_screen.dart'; // Import LoginScreen
import 'package:mobile_app/screens/home_screen.dart'; // Import HomeScreen
import 'package:mobile_app/screens/scanner_screen.dart'; // Import ScannerScreen
import 'package:mobile_app/screens/history_screen.dart'; // Import HistoryScreen

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'APP Check-in',
      theme: ThemeData(
        primarySwatch: Colors.green,
        visualDensity: VisualDensity.adaptivePlatformDensity,
      ),
      home: const SplashScreen(),
      routes: {
        '/login': (context) => const LoginScreen(),
        '/home': (context) => const HomeScreen(),
        '/scanner': (context) => const ScannerScreen(), // New route
        '/history': (context) => const HistoryScreen(), // New route
      },
    );
  }
}

class SplashScreen extends StatefulWidget {
  const SplashScreen({super.key});

  @override
  State<SplashScreen> createState() => _SplashScreenState();
}

class _SplashScreenState extends State<SplashScreen> {
  double _logoOpacity = 0.0;

  @override
  void initState() {
    super.initState();
    _animateLogo();
  }

  void _animateLogo() async {
    await Future.delayed(const Duration(milliseconds: 500));
    setState(() {
      _logoOpacity = 1.0;
    });
    await Future.delayed(const Duration(seconds: 2)); // Display logo for 2 seconds
    _navigateToLogin();
  }

  void _navigateToLogin() {
    Navigator.of(context).pushReplacementNamed('/login');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Colors.green[700], // Darker green background
      body: Stack(
        fit: StackFit.expand,
        children: <Widget>[
          Center(
            child: AnimatedOpacity(
              opacity: _logoOpacity,
              duration: const Duration(seconds: 1), // Fade in duration
              child: Image.asset(
                'assets/images/logo.png',
                height: 200, // Adjust logo size as needed
              ),
            ),
          ),
          const Positioned(
            bottom: 30,
            left: 0,
            right: 0,
            child: Text(
              'Africa Power Platform',
              textAlign: TextAlign.center,
              style: TextStyle(
                color: Colors.white,
                fontSize: 20,
                fontWeight: FontWeight.bold,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
