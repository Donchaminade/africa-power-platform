import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';

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
        backgroundColor: Colors.green,
        foregroundColor: Colors.white,
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
                  style: const TextStyle(fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ],
            );
          },
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
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
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            const Text(
              'Que souhaitez-vous faire ?',
              style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
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
                icon: const Icon(Icons.qr_code_scanner, size: 30),
                label: const Text('Scanner', style: TextStyle(fontSize: 20)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.green,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
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
                icon: const Icon(Icons.history, size: 30),
                label: const Text('Historique', style: TextStyle(fontSize: 20)),
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.blueAccent,
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}
