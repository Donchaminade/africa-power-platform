import 'package:flutter/material.dart';
import 'package:shared_preferences/shared_preferences.dart';
import 'dart:ui'; // Import for ImageFilter.blur

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen>
    with AutomaticKeepAliveClientMixin, TickerProviderStateMixin {
  @override
  bool get wantKeepAlive => true;

  late final AnimationController _controller;
  bool _contentVisible = false;

  final List<Map<String, dynamic>> _communityReasons = [
    {
      'icon': Icons.school_outlined,
      'text': 'Apprentissage continu et partage de connaissances',
    },
    {
      'icon': Icons.workspaces_outline,
      'text': 'Développement de réseau professionnel',
    },
    {
      'icon': Icons.lightbulb_outline,
      'text': 'Opportunités de collaboration sur des projets innovants',
    },
    {
      'icon': Icons.group_work_outlined,
      'text': 'Accès à des ressources exclusives et du mentorat',
    },
    {
      'icon': Icons.trending_up_outlined,
      'text': 'Inspiration et motivation pour l\'innovation',
    },
  ];

  final List<Map<String, dynamic>> _eventStats = [
    {'icon': Icons.mic_none_outlined, 'value': '+25', 'label': 'Speakers'},
    {'icon': Icons.people_outline, 'value': '+500', 'label': 'Participants'},
    {'icon': Icons.calendar_today_outlined, 'value': '2', 'label': 'Jours'},
    {'icon': Icons.layers_outlined, 'value': '+10', 'label': 'Ateliers'},
  ];

  @override
  void initState() {
    super.initState();
    _controller = AnimationController(
      duration: const Duration(seconds: 25),
      vsync: this,
    )..repeat(reverse: true);

    // Animate content visibility
    Future.delayed(const Duration(milliseconds: 300), () {
      if (mounted) {
        setState(() {
          _contentVisible = true;
        });
      }
    });
  }

  @override
  void dispose() {
    _controller.dispose();
    super.dispose();
  }

  Future<String?> _getUserName() async {
    SharedPreferences prefs = await SharedPreferences.getInstance();
    return prefs.getString('userName');
  }

  String _getInitials(String? fullName) {
    if (fullName == null || fullName.isEmpty) return '';
    List<String> parts = fullName.split(' ').where((p) => p.isNotEmpty).toList();
    if (parts.length >= 2)
    {
      return parts[0][0].toUpperCase() + parts[1][0].toUpperCase();
    } else if (parts.isNotEmpty) {
      return parts[0][0].toUpperCase();
    }
    return '';
  }

  @override
  Widget build(BuildContext context) {
    super.build(context);
    return Stack(
        children: [
          _buildAnimatedBackground(),
          SafeArea(
            child: SingleChildScrollView(
              physics: const BouncingScrollPhysics(),
              child: AnimatedOpacity(
                opacity: _contentVisible ? 1.0 : 0.0,
                duration: const Duration(milliseconds: 800),
                curve: Curves.easeIn,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    _buildHeader(),
                    const SizedBox(height: 20),
                    _buildWelcomeCard(),
                    const SizedBox(height: 30),
                    _buildSectionTitle("Pourquoi rejoindre la communauté ?"),
                    const SizedBox(height: 15),
                    _buildCommunityReasonsList(),
                    const SizedBox(height: 30),
                    _buildSectionTitle("L'événement en chiffres"),
                    const SizedBox(height: 15),
                    _buildStatsGrid(),
                    const SizedBox(height: 30),
                  ],
                ),
              ),
            ),
          ),
        ],
      );
  }

  Widget _buildAnimatedBackground() {
    final size = MediaQuery.of(context).size;
    return AnimatedBuilder(
      animation: _controller,
      builder: (context, child) {
        return Container(
          width: double.infinity,
          height: double.infinity,
          decoration: const BoxDecoration(
            gradient: LinearGradient(
              colors: [Color(0xFF004D40), Color(0xFF00796B)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
          ),
          child: Stack(
            children: [
              Positioned(
                top: size.height * 0.1 + (50 * _controller.value),
                left: size.width * 0.1 - (30 * _controller.value),
                child: _buildBlurredShape(Colors.white, 150),
              ),
              Positioned(
                top: size.height * 0.6 - (80 * _controller.value),
                right: size.width * 0.05 + (40 * _controller.value),
                child: _buildBlurredShape(Colors.white, 250),
              ),
              Positioned(
                bottom: 100 + 100 * (1 - _controller.value),
                left: 50 + 50 * _controller.value,
                child: Container(
                  height: 80,
                  width: 120,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(40),
                    color: Colors.white.withOpacity(0.08),
                  ),
                ),
              ),
            ],
          ),
        );
      },
    );
  }

  Widget _buildBlurredShape(Color color, double size) {
    return Container(
      width: size,
      height: size,
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        color: color.withOpacity(0.05),
      ),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 30, sigmaY: 30),
        child: Container(
          decoration: const BoxDecoration(shape: BoxShape.circle, color: Colors.transparent),
        ),
      ),
    );
  }

  Widget _buildHeader() {
    return Padding(
      padding: const EdgeInsets.fromLTRB(16, 16, 16, 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          FutureBuilder<String?>(
            future: _getUserName(),
            builder: (context, snapshot) {
              String userName = snapshot.data ?? 'Utilisateur';
              return Row(
                children: [
                  CircleAvatar(
                    backgroundColor: Colors.white,
                    foregroundColor: const Color(0xFF004D40),
                    child: Text(
                      _getInitials(userName),
                      style: const TextStyle(fontWeight: FontWeight.bold),
                    ),
                  ),
                  const SizedBox(width: 12),
                  Text(
                    'Hey, $userName!',
                    style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Colors.white),
                  ),
                ],
              );
            },
          ),
          IconButton(
            icon: const Icon(Icons.logout, color: Colors.white),
            onPressed: () async {
              SharedPreferences prefs = await SharedPreferences.getInstance();
              await prefs.clear();
              if (mounted) {
                Navigator.of(context).pushReplacementNamed('/login');
              }
            },
          ),
        ],
      ),
    );
  }

  Widget _buildWelcomeCard() {
    return Center(
      child: ClipRRect(
        borderRadius: BorderRadius.circular(20.0),
        child: BackdropFilter(
          filter: ImageFilter.blur(sigmaX: 15.0, sigmaY: 15.0),
          child: Container(
            width: MediaQuery.of(context).size.width * 0.9,
            padding: const EdgeInsets.all(24.0),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.15),
              borderRadius: BorderRadius.circular(20.0),
              border: Border.all(color: Colors.white.withOpacity(0.2)),
            ),
            child: const Column(
              children: [
                Text(
                  'Bienvenue sur l\'application Check-in !',
                  style: TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Colors.white),
                  textAlign: TextAlign.center,
                ),
                SizedBox(height: 16),
                Text(
                  'Utilisez la barre de navigation ci-dessous pour scanner les QR codes ou consulter l\'historique.',
                  style: TextStyle(fontSize: 16, color: Colors.white70),
                  textAlign: TextAlign.center,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildSectionTitle(String title) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Text(
        title,
        style: const TextStyle(
          color: Colors.white,
          fontSize: 22,
          fontWeight: FontWeight.bold,
        ),
      ),
    );
  }

  Widget _buildCommunityReasonsList() {
    return SizedBox(
      height: 160,
      child: ListView.builder(
        scrollDirection: Axis.horizontal,
        padding: const EdgeInsets.symmetric(horizontal: 16.0),
        itemCount: _communityReasons.length,
        itemBuilder: (context, index) {
          final reason = _communityReasons[index];
          return Container(
            width: 250,
            margin: const EdgeInsets.only(right: 12.0),
            child: ClipRRect(
              borderRadius: BorderRadius.circular(15.0),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
                child: Container(
                  padding: const EdgeInsets.all(16.0),
                  decoration: BoxDecoration(
                    color: Colors.white.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(15.0),
                    border: Border.all(color: Colors.white.withOpacity(0.2)),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Icon(reason['icon'], color: Colors.white, size: 28),
                      const SizedBox(height: 12),
                      Expanded(
                        child: Text(
                          reason['text'],
                          style: const TextStyle(color: Colors.white, fontSize: 15),
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ),
          );
        },
      ),
    );
  }

  Widget _buildStatsGrid() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: GridView.builder(
        gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
          crossAxisCount: 2,
          crossAxisSpacing: 12,
          mainAxisSpacing: 12,
          childAspectRatio: 1.6,
        ),
        itemCount: _eventStats.length,
        shrinkWrap: true,
        physics: const NeverScrollableScrollPhysics(),
        itemBuilder: (context, index) {
          final stat = _eventStats[index];
          return _buildStatCard(stat['value'], stat['label'], stat['icon']);
        },
      ),
    );
  }

  Widget _buildStatCard(String value, String label, IconData icon) {
    return ClipRRect(
      borderRadius: BorderRadius.circular(15.0),
      child: BackdropFilter(
        filter: ImageFilter.blur(sigmaX: 10.0, sigmaY: 10.0),
        child: Container(
          padding: const EdgeInsets.all(12.0),
          decoration: BoxDecoration(
            color: Colors.white.withOpacity(0.1),
            borderRadius: BorderRadius.circular(15.0),
            border: Border.all(color: Colors.white.withOpacity(0.2)),
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            children: [
              Icon(icon, color: Colors.white, size: 28),
              const SizedBox(height: 8),
              Text(
                value,
                style: const TextStyle(
                  fontSize: 22,
                  fontWeight: FontWeight.bold,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 2),
              Text(
                label,
                style: const TextStyle(fontSize: 14, color: Colors.white70),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
