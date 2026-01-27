import 'package:flutter/material.dart';
import 'package:mobile_app/screens/history_screen.dart';
import 'package:mobile_app/screens/home_screen.dart';
import 'package:mobile_app/screens/scanner_screen.dart';

class MainScreen extends StatefulWidget {
  const MainScreen({super.key});

  @override
  State<MainScreen> createState() => _MainScreenState();
}

class _MainScreenState extends State<MainScreen> {
  final PageController _pageController = PageController();
  int _selectedIndex = 0;

  void _onItemTapped(int index) {
    setState(() => _selectedIndex = index);
    _pageController.jumpToPage(index);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      extendBody: true,
      body: PageView(
        controller: _pageController,
        onPageChanged: (index) {
          setState(() => _selectedIndex = index);
        },
        children: const [
          HomeScreen(),
          ScannerScreen(),
          HistoryScreen(),
        ],
      ),

      // ================= FAB =================
      floatingActionButtonLocation:
          FloatingActionButtonLocation.centerDocked,
          
      floatingActionButton: FloatingActionButton(
        backgroundColor: Colors.white,
        
        onPressed: () => _onItemTapped(1),
        child: const Icon(Icons.qr_code_scanner, color: Color(0xFF004D40)),
        
      ),

      // ================= BOTTOM BAR =================
      bottomNavigationBar: BottomAppBar(
        shape: const CircularNotchedRectangle(),
        notchMargin: 8,
        color: const Color(0xFF004D40),
        child: SizedBox(
          height: 65,
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildNavItem(
                icon: Icons.home_rounded,
                label: 'Accueil',
                index: 0,
              ),

              // 🔥 espace FAB dynamique (réduction visuelle)
              AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                width: _selectedIndex == 1 ? 20 : 40,
              ),

              _buildNavItem(
                icon: Icons.history_rounded,
                label: 'Historique',
                index: 2,
              ),
            ],
          ),
        ),
      ),
    );
  }

  // ================= NAV ITEM =================
  Widget _buildNavItem({
    required IconData icon,
    required String label,
    required int index,
  }) {
    final bool isSelected = _selectedIndex == index;

    return Expanded(
      child: InkWell(
        onTap: () => _onItemTapped(index),
        splashColor: Colors.transparent,
        highlightColor: Colors.transparent,
        hoverColor: Colors.transparent,
        child: Center(
          child: AnimatedContainer(
            duration: const Duration(milliseconds: 300),
            curve: Curves.easeOutCubic,
            padding: EdgeInsets.symmetric(
              horizontal: isSelected ? 14 : 0,
              vertical: 8,
            ),
            decoration: BoxDecoration(
              color: isSelected
                  ? Colors.white.withOpacity(0.25)
                  : Colors.transparent,
              borderRadius: BorderRadius.circular(45), // 🟢 pill background
            ),
            child: AnimatedSwitcher(
              duration: const Duration(milliseconds: 250),
              switchInCurve: Curves.easeOut,
              switchOutCurve: Curves.easeIn,
              transitionBuilder: (child, animation) {
                return FadeTransition(
                  opacity: animation,
                  child: SizeTransition(
                    sizeFactor: animation,
                    axis: Axis.horizontal,
                    child: child,
                  ),
                );
              },
              child: isSelected
                  ? Row(
                      key: const ValueKey('active'),
                      mainAxisSize: MainAxisSize.min,
                      children: [
                        Icon(icon, color: Colors.white, size: 36),
                        const SizedBox(width: 2),
                        Text(
                          label,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 17,
                            // fontWeight: FontWeight.w600,
                            fontWeight: FontWeight.bold
                          ),
                        ),
                      ],
                    )
                  : Icon(
                      icon,
                      key: const ValueKey('inactive'),
                      color: Colors.white.withOpacity(0.9),
                      size: 36,
                    ),
            ),
          ),
        ),
      ),
    );
  }
}
