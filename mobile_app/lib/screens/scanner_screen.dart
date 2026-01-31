import 'package:flutter/material.dart';
import 'package:mobile_scanner/mobile_scanner.dart';
import 'package:http/http.dart' as http;
import 'dart:convert';
import '../config/api_config.dart';
import 'package:intl/intl.dart'; // For date formatting
import 'package:audioplayers/audioplayers.dart'; // For sound feedback
import 'package:vibration/vibration.dart'; // For haptic feedback

class ScannerScreen extends StatefulWidget {
  const ScannerScreen({super.key});

  @override
  State<ScannerScreen> createState() => _ScannerScreenState();
}

class _ScannerScreenState extends State<ScannerScreen>
    with SingleTickerProviderStateMixin {
  MobileScannerController cameraController = MobileScannerController(
    detectionSpeed: DetectionSpeed.noDuplicates,
    facing: CameraFacing.back,
    torchEnabled: false,
  );
  bool _isProcessingScan = false;
  String? _statusMessage;
  bool _isSuccess = false;

  bool _isTorchOn = false;
  CameraFacing _currentFacing = CameraFacing.back;

  final AudioPlayer _audioPlayer = AudioPlayer();

  late AnimationController _animationController;
  late Animation<double> _animation;

  @override
  void initState() {
    super.initState();
    _statusMessage = 'Scannez le QR code d\'un participant';

    // Initialize these states directly from the controller's constructor arguments
    _isTorchOn = cameraController.torchEnabled;
    _currentFacing = cameraController.facing;

    _animationController = AnimationController(
      vsync: this,
      duration: const Duration(seconds: 2),
    )..repeat(reverse: true);
    _animation = Tween<double>(
      begin: 0.0,
      end: 1.0,
    ).animate(_animationController);
  }

  Future<void> _playScanSound() async {
    // You need to place scan_sound.mp3 in the mobile_app/assets/ folder
    // and declare it in pubspec.yaml under the assets section.
    // Example: assets: - assets/scan_sound.mp3
    await _audioPlayer.play(AssetSource('scan_sound.mp3'));
  }

  Future<void> _vibrate() async {
    if (await Vibration.hasVibrator() == true) {
      Vibration.vibrate(duration: 50);
    }
  }

  Future<void> _fetchAndDisplayParticipant(String qrData) async {
    if (_isProcessingScan) return;

    setState(() {
      _isProcessingScan = true;
      _statusMessage = 'Récupération des informations du participant...';
      _isSuccess = false;
    });

    cameraController.stop(); // Stop scanner while dialog is open

    try {
      _playScanSound();
      _vibrate();

      int? registrationId;
      debugPrint('QR Data reçu: $qrData'); // Debug print
      try {
        final parsedData = json.decode(qrData);
        registrationId = parsedData['id'];
        debugPrint(
          'ID d\'enregistrement parsé (JSON): $registrationId',
        ); // Debug print
      } catch (e) {
        registrationId = int.tryParse(qrData);
        debugPrint(
          'ID d\'enregistrement parsé (int.tryParse): $registrationId',
        ); // Debug print
      }

      if (registrationId == null) {
        _showSnackbar(
          context,
          'Contenu du QR code invalide. Attendu: un JSON avec "id" ou un nombre.',
          false,
        );
        return; // Exit early if QR data is invalid
      }

      final requestUrl = '${ApiConfig.baseUrl}/registrations/$registrationId';
      debugPrint('Requête GET vers: $requestUrl'); // Debug print for URL
      final response = await http.get(
        Uri.parse(requestUrl),
        headers: {'Content-Type': 'application/json'},
      );

      debugPrint(
        'Réponse du serveur - Statut: ${response.statusCode}',
      ); // Debug print for status code
      debugPrint(
        'Réponse du serveur - Corps: ${response.body}',
      ); // Debug print for response body

      if (response.statusCode == 200) {
        final participant = json.decode(response.body);
        if (mounted) {
          // Check if participant is already checked in
          bool isAlreadyCheckedIn = (participant['is_checked_in'] == 1);
          if (isAlreadyCheckedIn) {
            _showAlreadyCheckedInDialog(
              participant,
            ); // Show dialog instead of snackbar
          } else {
            _showParticipantDetailsDialog(participant);
          }
        }
      } else {
        final errorData = json.decode(response.body);
        _showSnackbar(
          context,
          errorData['message'] ?? 'Participant non trouvé.',
          false,
        );
      }
    } catch (e) {
      debugPrint(
        'Erreur lors de la récupération du participant: $e',
      ); // Debug print for actual exception
      _showSnackbar(
        context,
        e.toString().contains('Exception:')
            ? e.toString().replaceFirst('Exception: ', '')
            : 'Erreur réseau ou du serveur.',
        false,
      );
    } finally {
      setState(() {
        _isProcessingScan = false;
      });
      // Scanner will resume after dialog is closed or after snackbar disappears
      _resumeScannerAfterDelay();
    }
  }

  Future<void> _performCheckIn(int registrationId) async {
    try {
      final response = await http.post(
        Uri.parse('${ApiConfig.baseUrl}/checkin/$registrationId'),
        headers: {'Content-Type': 'application/json'},
      );

      final responseData = json.decode(response.body);

      if (response.statusCode == 200) {
        _showSnackbar(
          context,
          responseData['message'] ?? 'Check-in réussi !',
          true,
        );
      } else {
        _showSnackbar(
          context,
          responseData['message'] ?? 'Échec du check-in.',
          false,
        );
      }
    } catch (e) {
      _showSnackbar(
        context,
        e.toString().contains('Exception:')
            ? e.toString().replaceFirst('Exception: ', '')
            : 'Erreur réseau ou du serveur.',
        false,
      );
    }
  }

  void _showAlreadyCheckedInDialog(Map<String, dynamic> participant) {
    DateTime? checkInTime = participant['check_in_time'] != null
        ? DateTime.parse(participant['check_in_time'])
        : null;

    showDialog(
      context: context,
      barrierDismissible: false,
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          title: const Text(
            'Participant Déjà Enregistré',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.orange),
          ),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildDetailRow(
                  'Nom:',
                  '${participant['first_name']} ${participant['last_name']}',
                ),
                _buildDetailRow('Email:', participant['email']),
                _buildDetailRow(
                  'Pass:',
                  participant['pass_type']
                      .toString()
                      .replaceAll('_', ' ')
                      .toUpperCase(),
                ),
                _buildDetailRow('Statut Check-in:', 'Oui', color: Colors.green),
                if (checkInTime != null)
                  _buildDetailRow(
                    'Heure Check-in:',
                    DateFormat('dd/MM/yyyy HH:mm:ss').format(checkInTime),
                  ),
                const SizedBox(height: 20),
                const Text(
                  'Ce participant a déjà été enregistré.',
                  style: TextStyle(
                    color: Colors.orange,
                    fontStyle: FontStyle.italic,
                  ),
                ),
              ],
            ),
          ),
          actions: [
            ElevatedButton(
              onPressed: () {
                Navigator.of(dialogContext).pop(); // Close dialog
              },
              style: ElevatedButton.styleFrom(
                backgroundColor: Colors.orange,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(
                  borderRadius: BorderRadius.circular(10),
                ),
              ),
              child: const Text('Fermer'),
            ),
          ],
        );
      },
    ).then((_) {
      _resumeScannerAfterDelay();
    });
  }

  void _showParticipantDetailsDialog(Map<String, dynamic> participant) {
    bool isAlreadyCheckedIn = (participant['is_checked_in'] == 1);
    DateTime? checkInTime = participant['check_in_time'] != null
        ? DateTime.parse(participant['check_in_time'])
        : null;

    showDialog(
      context: context,
      barrierDismissible: false, // User must tap button to close
      builder: (BuildContext dialogContext) {
        return AlertDialog(
          shape: RoundedRectangleBorder(
            borderRadius: BorderRadius.circular(15),
          ),
          title: const Text(
            'Détails du Participant',
            style: TextStyle(fontWeight: FontWeight.bold, color: Colors.green),
          ),
          content: SingleChildScrollView(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min,
              children: [
                _buildDetailRow(
                  'Nom:',
                  '${participant['first_name']} ${participant['last_name']}',
                ),
                _buildDetailRow('Email:', participant['email']),
                _buildDetailRow(
                  'Pass:',
                  participant['pass_type']
                      .toString()
                      .replaceAll('_', ' ')
                      .toUpperCase(),
                ),
                _buildDetailRow(
                  'Statut Check-in:',
                  isAlreadyCheckedIn ? 'Oui' : 'Non',
                  color: isAlreadyCheckedIn ? Colors.green : Colors.red,
                ),
                if (isAlreadyCheckedIn && checkInTime != null)
                  _buildDetailRow(
                    'Heure Check-in:',
                    DateFormat('dd/MM/yyyy HH:mm:ss').format(checkInTime),
                  ),
                const SizedBox(height: 20),
                if (isAlreadyCheckedIn)
                  const Text(
                    'Ce participant est déjà enregistré.',
                    style: TextStyle(
                      color: Colors.orange,
                      fontStyle: FontStyle.italic,
                    ),
                  ),
              ],
            ),
          ),
          actions: [
            TextButton(
              onPressed: () {
                Navigator.of(dialogContext).pop(); // Close dialog
              },
              child: const Text('Fermer', style: TextStyle(color: Colors.grey)),
            ),
            if (!isAlreadyCheckedIn)
              ElevatedButton(
                onPressed: () async {
                  Navigator.of(dialogContext).pop(); // Close dialog first
                  await _performCheckIn(participant['id']);
                },
                style: ElevatedButton.styleFrom(
                  backgroundColor: const Color(0xFF004D40),
                  foregroundColor: Colors.white,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                child: const Text('Confirmer Check-in'),
              ),
          ],
        );
      },
    ).then((_) {
      // Ensure scanner resumes after dialog is closed
      _resumeScannerAfterDelay();
    });
  }

  Widget _buildDetailRow(String label, String value, {Color? color}) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          SizedBox(
            width: 100,
            child: Text(
              label,
              style: const TextStyle(fontWeight: FontWeight.bold),
            ),
          ),
          Expanded(
            child: Text(
              value,
              style: TextStyle(color: color ?? Colors.black87),
            ),
          ),
        ],
      ),
    );
  }

  void _showSnackbar(BuildContext context, String message, bool isSuccess) {
    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(
        content: Text(message),
        backgroundColor: isSuccess ? const Color.fromARGB(255, 25, 133, 28) : Colors.red,
        duration: const Duration(seconds: 5),
      ),
    );
  }

  void _resumeScannerAfterDelay() async {
    await Future.delayed(
      const Duration(seconds: 3),
    ); // Give some time for UI to settle
    if (mounted) {
      cameraController.start();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Scanner QR Code'),
        backgroundColor: const Color(0xFF004D40),
        foregroundColor: Colors.white,
        actions: [
          IconButton(
            color: Colors.white,
            icon: (_isTorchOn)
                ? const Icon(Icons.flash_on, color: Colors.yellow)
                : const Icon(Icons.flash_off, color: Colors.grey),
            iconSize: 32.0,
            onPressed: () async {
              await cameraController.toggleTorch();
              setState(() {
                _isTorchOn = !_isTorchOn;
              });
            },
          ),
          IconButton(
            color: Colors.white,
            icon: (_currentFacing == CameraFacing.front)
                ? const Icon(Icons.camera_front)
                : const Icon(Icons.camera_rear),
            iconSize: 32.0,
            onPressed: () async {
              await cameraController.switchCamera();
              setState(() {
                _currentFacing = (_currentFacing == CameraFacing.back)
                    ? CameraFacing.front
                    : CameraFacing.back;
              });
            },
          ),
        ],
      ),
      body: Stack(
        children: [
          !_isProcessingScan
              ? MobileScanner(
                  controller: cameraController,
                  onDetect: (capture) {
                    final List<Barcode> barcodes = capture.barcodes;
                    if (barcodes.isNotEmpty && !_isProcessingScan) {
                      final barcode = barcodes.first;
                      if (barcode.rawValue != null) {
                        _fetchAndDisplayParticipant(barcode.rawValue!);
                      }
                    }
                  },
                )
              : Container(), // Show an empty container when processing to hide camera
          Positioned.fill(
            child: Align(
              alignment: Alignment.center,
              child: AspectRatio(
                aspectRatio: 1, // Square scanning area
                child: Container(
                  margin: const EdgeInsets.all(50),
                  decoration: BoxDecoration(
                    border: Border.all(color: Colors.white, width: 2),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: AnimatedBuilder(
                    animation: _animation,
                    builder: (context, child) {
                      return CustomPaint(
                        painter: _ScanLinePainter(
                          animationValue: _animation.value,
                        ),
                      );
                    },
                  ),
                ),
              ),
            ),
          ),
          if (_isProcessingScan)
            const Center(child: CircularProgressIndicator(color: Colors.green)),
          Positioned(
            bottom: 20,
            left: 0,
            right: 0,
            child: Container(
              padding: const EdgeInsets.symmetric(horizontal: 20, vertical: 10),
              color: Colors.black54,
              child: Text(
                _statusMessage ?? 'Scannez le QR code d\'un participant',
                textAlign: TextAlign.center,
                style: TextStyle(
                  color: _isSuccess ? Colors.greenAccent : Colors.white,
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }

  @override
  void dispose() {
    _animationController.dispose();
    cameraController.dispose();
    _audioPlayer.dispose();
    super.dispose();
  }
}

class _ScanLinePainter extends CustomPainter {
  final double animationValue;

  _ScanLinePainter({required this.animationValue});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()
      ..color = Colors.greenAccent
      ..strokeWidth = 3.0
      ..strokeCap = StrokeCap.round;

    final lineY = size.height * animationValue;
    canvas.drawLine(Offset(0, lineY), Offset(size.width, lineY), paint);
  }

  @override
  bool shouldRepaint(covariant _ScanLinePainter oldDelegate) {
    return oldDelegate.animationValue != animationValue;
  }
}
