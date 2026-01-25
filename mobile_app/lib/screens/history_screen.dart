import 'package:flutter/material.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import 'package:intl/intl.dart'; // Import the intl package
import '../config/api_config.dart';

class HistoryScreen extends StatefulWidget {
  const HistoryScreen({super.key});

  @override
  State<HistoryScreen> createState() => _HistoryScreenState();
}

class _HistoryScreenState extends State<HistoryScreen> {
  List<dynamic> _checkedInParticipants = [];
  bool _isLoading = true;
  String? _errorMessage;

  @override
  void initState() {
    super.initState();
    _fetchCheckedInHistory();
  }

  Future<void> _fetchCheckedInHistory() async {
    setState(() {
      _isLoading = true;
      _errorMessage = null;
    });

    try {
      final response = await http.get(Uri.parse('${ApiConfig.baseUrl}/checkin/history'));

      if (response.statusCode == 200) {
        setState(() {
          _checkedInParticipants = json.decode(response.body);
        });
      } else {
        final errorData = json.decode(response.body);
        setState(() {
          _errorMessage = errorData['message'] ?? 'Échec de la récupération de l\'historique.';
        });
      }
    } catch (e) {
      setState(() {
        _errorMessage = 'Erreur réseau ou du serveur lors de la récupération de l\'historique.';
      });
    } finally {
      setState(() {
        _isLoading = false;
      });
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Historique Check-in'),
        backgroundColor: Colors.blueAccent,
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            icon: const Icon(Icons.refresh),
            onPressed: _fetchCheckedInHistory,
          ),
        ],
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _errorMessage != null
              ? Center(
                  child: Padding(
                    padding: const EdgeInsets.all(20.0),
                    child: Text(
                      _errorMessage!,
                      textAlign: TextAlign.center,
                      style: const TextStyle(color: Colors.red, fontSize: 16),
                    ),
                  ),
                )
              : _checkedInParticipants.isEmpty
                  ? const Center(
                      child: Text(
                        'Aucun participant n\'a été enregistré pour le moment.',
                        textAlign: TextAlign.center,
                        style: TextStyle(fontSize: 18, color: Colors.grey),
                      ),
                    )
                  : ListView.builder(
                      itemCount: _checkedInParticipants.length,
                      itemBuilder: (context, index) {
                        final participant = _checkedInParticipants[index];
                        final checkInTime = participant['check_in_time'] != null
                            ? DateFormat('dd/MM/yyyy HH:mm:ss').format(DateTime.parse(participant['check_in_time']))
                            : 'N/A';
                        return Card(
                          margin: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          elevation: 2,
                          child: ListTile(
                            leading: const Icon(Icons.person, color: Colors.green),
                            title: Text(
                              '${participant['first_name']} ${participant['last_name']}',
                              style: const TextStyle(fontWeight: FontWeight.bold),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(participant['email']),
                                Text('Pass: ${participant['pass_type'].toString().replaceAll('_', ' ').toUpperCase()}'),
                                Text('Check-in: $checkInTime'),
                              ],
                            ),
                            trailing: const Icon(Icons.check_circle, color: Colors.green),
                          ),
                        );
                      },
                    ),
    );
  }
}