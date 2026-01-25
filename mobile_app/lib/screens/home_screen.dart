import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:ui'; // Import for ImageFilter.blur

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  Future<String?> _getUserName() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('userName');
  }

  String _getInitials(String? fullName) {
    if (fullName == null || fullName.isEmpty) {
      return '';
    }
    List<String> parts = fullName.split(' ');
    if (parts.length >= 2) {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    } else if (parts.isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.transparent, // Make app bar transparent
        foregroundColor: Colors.white,
        elevation: 0, // Remove shadow
        title: FutureBuilder<String?>(
          future: _getUserName(),
          builder: (context, snapshot) {
            String userName = snapshot.data ?? 'Utilisateur';
            String initials = _getInitials(userName);
            
            return Row(
              children: [
                CircleAvatar(
                  backgroundColor: Colors.white,
                  foregroundColor: Colors.green,
                  child: Text(
                    initials,
                    style: const TextStyle(fontWeight: FontWeight.bold),
                  ),
                ),
                const SizedBox(width: 10),
                Text(
                  'Hey, $userName!',
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.white), // Ensure text is white
                ),
              ],
            );
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white), // Ensure icon is white
            onPressed: () async {
              SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.clear(); // Clear user data
              if (context.mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            },
          ),
        ],
      ),
      extendBodyBehindAppBar: true, // Extend body behind the transparent app bar
      body: Stack(
        children: [
          // Background with gradient (matching login screen)
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
                  child: Column(
                    mainAxisSize: MainAxisSize.min, // Use min to wrap content
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      const Text(
                        'Que souhaitez-vous faire ?',
                        style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.white), // Text color for contrast
                        textAlign: TextAlign.center,
                      ),
                      const SizedBox(height: 50),
                      SizedBox(
                        width: 200,
                        height: 60,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.of(context).pushNamed('/scanner'); // Navigate to QR Scanner
                          },
                          icon: const Icon(Icons.qr_code_scanner, size: 30, color: Color.fromARGB(255, 33, 150, 243)), // Icon color
                          label: const Text('Scanner', style: TextStyle(fontSize: 20, color: Color.fromARGB(255, 33, 150, 243))), // Text color
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white.withOpacity(0.8), // Translucent white button
                            foregroundColor: Color.fromARGB(255, 33, 150, 243), // Text color for button
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            elevation: 5,
                          ),
                        ),
                      ),
                      const SizedBox(height: 30),
                      SizedBox(
                        width: 200,
                        height: 60,
                        child: ElevatedButton.icon(
                          onPressed: () {
                            Navigator.of(context).pushNamed('/history'); // Navigate to History
                          },
                          icon: const Icon(Icons.history, size: 30, color: Colors.blueAccent), // Icon color
                          label: const Text('Historique', style: TextStyle(fontSize: 20, color: Colors.blueAccent)), // Text color
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white.withOpacity(0.8), // Translucent white button
                            foregroundColor: Colors.blueAccent, // Text color for button
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(10),
                            ),
                            elevation: 5,
                          ),
                        ),
                      ),
                    ],
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
